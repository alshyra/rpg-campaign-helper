import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import type { CharacterState, InventoryItem, NoteEntry, Profile, Skill, Spell, Stat } from "../types/character";
import { useDriveSync } from "../composables/useDriveSync";
import {
  CAMPAIGNS_STORAGE_KEY,
  SINGLE_STORAGE_KEY,
  type StoredState,
  makeId,
  parseStoredState,
  sanitizeState,
} from "./character.helpers";

export const useCharacterStore = defineStore("character", () => {
  const stored = ref<StoredState>(parseStoredState());
  const driveSync = useDriveSync();

  // When Drive connects, pull remote data and apply if newer (last-write-wins)
  watch(
    () => driveSync.isConnected.value,
    async (connected) => {
      if (!connected) return;
      try {
        const remote = await driveSync.load();
        if (remote) {
          // Returning user restoring from Drive — skip onboarding
          window.localStorage.setItem("rpg-player-helper::onboarding-seen", "true");
          if ((remote.updatedAt ?? "0") > (stored.value.updatedAt ?? "0")) {
            stored.value = remote;
          }
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.error("Drive on-connect load error:", message);
      }
    },
  );

  const state = computed<CharacterState | null>(() => {
    if (!stored.value.activeCampaignId) {
      return null;
    }

    const active = stored.value.campaigns.find((campaign) => campaign.id === stored.value.activeCampaignId);
    return active?.character ?? null;
  });

  const hasCharacter = computed(() => state.value !== null);

  const campaigns = computed(() =>
    stored.value.campaigns.map((campaign) => ({
      id: campaign.id,
      characterName: campaign.character.profile.characterName || "Sans nom",
      role: campaign.character.profile.role || "Sans rôle",
      avatarDataUrl: campaign.character.profile.avatarDataUrl || "",
      updatedAt: campaign.character.updatedAt,
      systemId: campaign.character.systemId,
    })),
  );

  const activeCampaignId = computed(() => stored.value.activeCampaignId);

  const injuryRatio = computed(() => {
    if (!state.value) {
      return 0;
    }

    const systemData = state.value.systemData as { injuries?: { light: number; minor: number; major: number; fatal: number } } | undefined;
    const { light = 0, minor = 0, major = 0, fatal = 0 } = systemData?.injuries ?? state.value.profile.injuries;
    const usedSlots = light + minor + major + fatal;
    const totalSlots = 8;

    return Math.max(0, Math.min(1, usedSlots / totalSlots));
  });

  const updateActiveCharacter = (updater: (character: CharacterState) => CharacterState) => {
    const activeId = stored.value.activeCampaignId;
    if (!activeId) {
      return;
    }

    stored.value.campaigns = stored.value.campaigns.map((campaign) =>
      campaign.id === activeId
        ? {
            ...campaign,
            character: updater(campaign.character),
          }
        : campaign,
    );
  };

  const saveActiveCharacter = (payload: Partial<CharacterState>) => {
    const activeId = stored.value.activeCampaignId;
    if (!activeId) {
      return;
    }

    updateActiveCharacter((character) =>
      sanitizeState({ ...character, ...payload, updatedAt: new Date().toISOString() }),
    );
  };

  const createNewCharacter = (payload: Partial<CharacterState>) => {
    const id = makeId("camp");
    const character = sanitizeState({ ...payload, updatedAt: new Date().toISOString() });
    stored.value.campaigns = [{ id, character }, ...stored.value.campaigns];
    stored.value.activeCampaignId = id;
  };

  const createCharacter = (payload: Partial<CharacterState>) => {
    if (stored.value.activeCampaignId) {
      saveActiveCharacter(payload);
      return;
    }
    createNewCharacter(payload);
  };

  const selectCampaign = (id: string) => {
    if (stored.value.campaigns.some((campaign) => campaign.id === id)) {
      stored.value.activeCampaignId = id;
    }
  };

  const deleteCampaign = (id: string) => {
    const nextCampaigns = stored.value.campaigns.filter((campaign) => campaign.id !== id);
    stored.value.campaigns = nextCampaigns;

    if (stored.value.activeCampaignId === id) {
      stored.value.activeCampaignId = nextCampaigns[0]?.id ?? null;
    }
  };

  const updateProfile = (patch: Partial<Profile>) => {
    updateActiveCharacter((character) => ({
      ...character,
      profile: {
        ...character.profile,
        ...patch,
        injuries: {
          ...character.profile.injuries,
          ...patch.injuries,
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateStat = (key: Stat["key"], value: number) => {
    updateActiveCharacter((character) => ({
      ...character,
      stats: character.stats.map((stat) => (stat.key === key ? { ...stat, value } : stat)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addSkill = (skill: Omit<Skill, "id">) => {
    updateActiveCharacter((character) => ({
      ...character,
      skills: [{ ...skill, id: makeId("skill") }, ...character.skills],
      updatedAt: new Date().toISOString(),
    }));
  };

  const removeSkill = (id: string) => {
    updateActiveCharacter((character) => ({
      ...character,
      skills: character.skills.filter((skill) => skill.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateSkill = (id: string, patch: Partial<Omit<Skill, "id">>) => {
    updateActiveCharacter((character) => ({
      ...character,
      skills: character.skills.map((skill) => (skill.id === id ? { ...skill, ...patch } : skill)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    updateActiveCharacter((character) => ({
      ...character,
      inventory: [{ ...item, id: makeId("item") }, ...character.inventory],
      updatedAt: new Date().toISOString(),
    }));
  };

  const removeInventoryItem = (id: string) => {
    updateActiveCharacter((character) => ({
      ...character,
      inventory: character.inventory.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateInventoryItem = (id: string, patch: Partial<Omit<InventoryItem, "id">>) => {
    updateActiveCharacter((character) => ({
      ...character,
      inventory: character.inventory.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addNote = (note: Omit<NoteEntry, "id" | "createdAt">) => {
    updateActiveCharacter((character) => ({
      ...character,
      notes: [
        {
          ...note,
          id: makeId("note"),
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...character.notes,
      ],
      updatedAt: new Date().toISOString(),
    }));
  };

  const removeNote = (id: string) => {
    updateActiveCharacter((character) => ({
      ...character,
      notes: character.notes.filter((note) => note.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addSpell = (spell: Omit<Spell, "id">) => {
    updateActiveCharacter((character) => ({
      ...character,
      spells: [{ ...spell, id: makeId("spell") }, ...character.spells],
      updatedAt: new Date().toISOString(),
    }));
  };

  const removeSpell = (id: string) => {
    updateActiveCharacter((character) => ({
      ...character,
      spells: character.spells.filter((spell) => spell.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateSpell = (id: string, patch: Partial<Omit<Spell, "id">>) => {
    updateActiveCharacter((character) => ({
      ...character,
      spells: character.spells.map((spell) => (spell.id === id ? { ...spell, ...patch } : spell)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const serialize = () => JSON.stringify(state.value, null, 2);

  const importFromObject = (payload: unknown) => {
    const parsed = payload as Partial<CharacterState>;
    createNewCharacter(sanitizeState(parsed));
  };

  const getSystemData = <T>(): T | null => {
    if (!state.value) return null;
    return (state.value.systemData ?? {}) as T;
  };

  const updateSystemData = <T>(patch: Partial<T>) => {
    updateActiveCharacter((character) => ({
      ...character,
      systemData: { ...(character.systemData as object), ...patch },
      updatedAt: new Date().toISOString(),
    }));
  };

  const clearCharacter = () => {
    stored.value.activeCampaignId = null;
  };

  watch(
    stored,
    async (value) => {
      const valueWithTs: StoredState = { ...value, updatedAt: new Date().toISOString() };
      window.localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(valueWithTs));
      window.localStorage.removeItem(SINGLE_STORAGE_KEY);
      if (driveSync.isConnected.value) {
        try {
          await driveSync.save(valueWithTs);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          console.error("Drive save error:", message);
          // If token is gone (e.g. expired), mark as disconnected so UI shows reconnect
          if (e instanceof Error && e.message.includes("reconnect")) {
            driveSync.disconnect();
          }
        }
      }
    },
    { deep: true },
  );

  return {
    state,
    hasCharacter,
    campaigns,
    activeCampaignId,
    injuryRatio,
    createCharacter,
    createNewCharacter,
    saveActiveCharacter,
    selectCampaign,
    deleteCampaign,
    updateProfile,
    updateStat,
    addSkill,
    removeSkill,
    updateSkill,
    addInventoryItem,
    removeInventoryItem,
    updateInventoryItem,
    addNote,
    removeNote,
    addSpell,
    removeSpell,
    updateSpell,
    getSystemData,
    updateSystemData,
    serialize,
    importFromObject,
    clearCharacter,
  };
});
