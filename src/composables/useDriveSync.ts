import { ref } from "vue";
import type { StoredState } from "../stores/character.helpers";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILE_NAME = "campaigns.json";

// ── Module-level singletons (shared across all composable calls) ────────────
let accessToken: string | null = null;
let gsiScriptPromise: Promise<void> | null = null;

// isConnected is always false on page load – access token is in-memory only.
// sessionStorage is used only to persist across HMR, not across full page reloads.
export const isConnected = ref(false);
export const isSyncing = ref(false);
export const lastSyncedAt = ref<Date | null>(null);

// ── Internal helpers ─────────────────────────────────────────────────────────

function loadGsiScript(): Promise<void> {
  if (gsiScriptPromise) return gsiScriptPromise;

  gsiScriptPromise = new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gsiScriptPromise = null;
      reject(new Error("Failed to load GSI script"));
    };
    document.head.appendChild(script);
  });

  return gsiScriptPromise;
}

/**
 * Request an OAuth2 access token.
 * @param silent - if true, use prompt:"none" (no popup, fails if no cached grant).
 *                 if false, open the consent popup (requires user gesture).
 */
async function requestToken(silent = false): Promise<string> {
  await loadGsiScript();
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response: google.accounts.oauth2.TokenResponse) => {
        if ("error" in response && response.error) {
          reject(new Error(response.error as string));
          return;
        }
        accessToken = response.access_token;
        resolve(accessToken);
      },
      error_callback: (err: { type: string }) => {
        reject(new Error(err.type));
      },
    });
    client.requestAccessToken({ prompt: silent ? "none" : "" });
  });
}

async function driveRequest(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  if (!accessToken) {
    throw new Error("No access token – user must reconnect");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired – mark as disconnected. User must click "Connecter" again.
    accessToken = null;
    isConnected.value = false;
    throw new Error("Token expired – please reconnect Google Drive");
  }
  return res;
}

async function findFile(): Promise<string | null> {
  const res = await driveRequest(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27${encodeURIComponent(FILE_NAME)}%27&fields=files(id)`,
  );
  if (!res.ok) throw new Error(`Drive list failed: ${res.status}`);
  const data = (await res.json()) as { files: { id: string }[] };
  return data.files[0]?.id ?? null;
}

async function uploadFile(data: StoredState, fileId: string | null): Promise<void> {
  const body = JSON.stringify(data);
  const boundary = "rpg_drive_boundary";
  const metadata = JSON.stringify({
    name: FILE_NAME,
    parents: fileId ? undefined : ["appDataFolder"],
  });

  const multipart = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    metadata,
    `--${boundary}`,
    "Content-Type: application/json",
    "",
    body,
    `--${boundary}--`,
  ].join("\r\n");

  const url = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&spaces=appDataFolder`;

  const res = await driveRequest(url, {
    method: fileId ? "PATCH" : "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body: multipart,
  });

  if (!res.ok) throw new Error(`Drive upload failed: ${res.status}`);
}

async function downloadFile(fileId: string): Promise<StoredState | null> {
  const res = await driveRequest(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
  );
  if (!res.ok) throw new Error(`Drive download failed: ${res.status}`);
  return res.json() as Promise<StoredState>;
}

// ── Composable ───────────────────────────────────────────────────────────────

export function useDriveSync() {
  /**
   * Connect: loads GSI, opens OAuth popup, stores token in memory only.
   * Must be called from a user gesture (click).
   */
  async function connect(): Promise<void> {
    await loadGsiScript();
    await requestToken(false);
    isConnected.value = true;
  }

  function disconnect(): void {
    const tokenToRevoke = accessToken;
    accessToken = null;
    isConnected.value = false;
    if (tokenToRevoke && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(tokenToRevoke, () => {});
    }
  }

  async function save(data: StoredState): Promise<void> {
    if (!isConnected.value) return;
    isSyncing.value = true;
    try {
      const fileId = await findFile();
      await uploadFile(data, fileId);
      lastSyncedAt.value = new Date();
    } finally {
      isSyncing.value = false;
    }
  }

  async function load(): Promise<StoredState | null> {
    if (!isConnected.value) return null;
    isSyncing.value = true;
    try {
      const fileId = await findFile();
      if (!fileId) return null;
      const data = await downloadFile(fileId);
      lastSyncedAt.value = new Date();
      return data;
    } finally {
      isSyncing.value = false;
    }
  }

  return { isConnected, isSyncing, lastSyncedAt, connect, disconnect, save, load };
}
