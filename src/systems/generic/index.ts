import { defineSystem } from "../registry";
import GenericCharacterWizard from "./components/GenericCharacterWizard.vue";
import GenericHealthSection from "./components/GenericHealthSection.vue";
import GenericInventorySection from "./components/GenericInventorySection.vue";
import GenericNotesSection from "./components/GenericNotesSection.vue";
import GenericProfileSection from "./components/GenericProfileSection.vue";
import GenericSkillsSection from "./components/GenericSkillsSection.vue";
import GenericSpellsSection from "./components/GenericSpellsSection.vue";
import type { GenericSystemData } from "./types";

export default defineSystem<GenericSystemData>({
  id: "generic",
  name: "Générique",
  description: "Système JDR maison (caracs D6, blessures 8 slots)",
  components: {
    CharacterWizard: GenericCharacterWizard,
    ProfileSection: GenericProfileSection,
    HealthSection: GenericHealthSection,
    SkillsSection: GenericSkillsSection,
    SpellsSection: GenericSpellsSection,
    InventorySection: GenericInventorySection,
    NotesSection: GenericNotesSection,
  },
  createBlankState: () => ({
    stats: [
      { key: "dex", label: "DEX", value: 0 },
      { key: "for", label: "FOR", value: 0 },
      { key: "con", label: "CON", value: 0 },
      { key: "int", label: "INT", value: 0 },
      { key: "sag", label: "SAG", value: 0 },
      { key: "cha", label: "CHA", value: 0 },
    ],
    skills: [],
    inventory: [],
    notes: [],
    spells: [],
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  }),
});
