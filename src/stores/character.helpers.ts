import type { CharacterState, InventoryItem, NoteEntry, Skill, Spell, Stat } from "../types/character";

export const SINGLE_STORAGE_KEY = "rpg-player-helper::character";
export const CAMPAIGNS_STORAGE_KEY = "rpg-player-helper::campaigns";

export type StoredCampaign = {
  id: string;
  character: CharacterState;
};

export type StoredState = {
  activeCampaignId: string | null;
  campaigns: StoredCampaign[];
  updatedAt?: string;
};

const blankStats: Stat[] = [
  { key: "dex", label: "DEX", value: 0 },
  { key: "for", label: "FOR", value: 0 },
  { key: "con", label: "CON", value: 0 },
  { key: "int", label: "INT", value: 0 },
  { key: "sag", label: "SAG", value: 0 },
  { key: "cha", label: "CHA", value: 0 },
];

export const defaultState = (): CharacterState => ({
  systemId: "generic",
  profile: {
    characterName: "",
    role: "",
    mood: "",
    avatarDataUrl: "",
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  },
  systemData: {
    stats: blankStats,
    skills: [],
    inventory: [],
    notes: [],
    spells: [],
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  },
  stats: blankStats,
  skills: [],
  inventory: [],
  notes: [],
  spells: [],
  updatedAt: new Date().toISOString(),
});

export const cloneDefault = () => structuredClone(defaultState());

export const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const pickSystemFields = (src: Partial<CharacterState>): Record<string, unknown> => ({
  stats: Array.isArray(src.stats) ? src.stats : cloneDefault().stats,
  skills: Array.isArray(src.skills) ? src.skills : cloneDefault().skills,
  inventory: Array.isArray(src.inventory) ? src.inventory : cloneDefault().inventory,
  notes: Array.isArray(src.notes) ? src.notes : cloneDefault().notes,
  spells: Array.isArray(src.spells) ? src.spells : cloneDefault().spells,
  injuries: {
    ...cloneDefault().profile.injuries,
    ...src.profile?.injuries,
  },
});

export const sanitizeState = (payload: Partial<CharacterState>): CharacterState => {
  const base = cloneDefault();
  const systemData = payload.systemData ?? pickSystemFields(payload);
  return {
    ...base,
    ...payload,
    systemId: payload.systemId ?? "generic",
    systemData,
    profile: {
      ...base.profile,
      ...payload.profile,
      avatarDataUrl:
        typeof payload.profile?.avatarDataUrl === "string" ? payload.profile.avatarDataUrl : "",
      injuries: {
        ...base.profile.injuries,
        ...payload.profile?.injuries,
      },
    },
    stats: Array.isArray(payload.stats) ? (payload.stats as Stat[]) : base.stats,
    skills: Array.isArray(payload.skills) ? (payload.skills as Skill[]) : base.skills,
    inventory: Array.isArray(payload.inventory) ? (payload.inventory as InventoryItem[]) : base.inventory,
    notes: Array.isArray(payload.notes) ? (payload.notes as NoteEntry[]) : base.notes,
    updatedAt: payload.updatedAt ?? new Date().toISOString(),
  };
};

export const parseLegacySingle = (): StoredState => {
  const raw = window.localStorage.getItem(SINGLE_STORAGE_KEY);
  if (!raw) {
    return {
      activeCampaignId: null,
      campaigns: [],
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CharacterState>;
    const id = makeId("camp");
    return {
      activeCampaignId: id,
      campaigns: [
        {
          id,
          character: sanitizeState(parsed),
        },
      ],
    };
  } catch {
    return {
      activeCampaignId: null,
      campaigns: [],
    };
  }
};

export const parseStoredState = (): StoredState => {
  const raw = window.localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
  if (!raw) {
    return parseLegacySingle();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    const campaigns = Array.isArray(parsed.campaigns)
      ? parsed.campaigns.map((campaign) => ({
          id: campaign.id ?? makeId("camp"),
          character: sanitizeState(campaign.character),
        }))
      : [];

    const activeCampaignId =
      campaigns.find((campaign) => campaign.id === parsed.activeCampaignId)?.id ?? campaigns[0]?.id ?? null;

    return {
      activeCampaignId,
      campaigns,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : undefined,
    };
  } catch {
    return parseLegacySingle();
  }
};
