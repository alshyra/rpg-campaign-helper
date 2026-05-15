import { defineSystem } from "../registry"
import { makeBlankCharacteristics, HUMAN_BASE, computeCurrent } from "./types"
import type { WfrpSystemData } from "./types"
import WarhammerCharacterWizard from "./components/WarhammerCharacterWizard.vue"
import WarhammerProfileSection from "./components/WarhammerProfileSection.vue"
import WarhammerHealthSection from "./components/WarhammerHealthSection.vue"
import WarhammerSkillsSection from "./components/WarhammerSkillsSection.vue"
import WarhammerSpellsSection from "./components/WarhammerSpellsSection.vue"
import WarhammerInventorySection from "./components/WarhammerInventorySection.vue"
import WarhammerNotesSection from "./components/WarhammerNotesSection.vue"

export default defineSystem<WfrpSystemData>({
  id: "warhammer",
  name: "Warhammer Fantasy 4e",
  description: "Grim dark fantasy, carrières et destin.",
  components: {
    CharacterWizard: WarhammerCharacterWizard,
    ProfileSection: WarhammerProfileSection,
    HealthSection: WarhammerHealthSection,
    SkillsSection: WarhammerSkillsSection,
    SpellsSection: WarhammerSpellsSection,
    InventorySection: WarhammerInventorySection,
    NotesSection: WarhammerNotesSection,
  },
  createBlankState: () => ({
    species: "Humain",
    characteristics: {
      base: HUMAN_BASE,
      spent: makeBlankCharacteristics(),
      advancements: makeBlankCharacteristics(),
      current: computeCurrent(HUMAN_BASE, makeBlankCharacteristics(), makeBlankCharacteristics()),
    },
    wounds: { current: 12, max: 12 },
    fate: 2,
    resolve: 2,
    xp: { total: 0, available: 0 },
    career: { current: "", plan: "", status: "Argent 1", promotions: 1 },
    skills: {},
    talents: [],
    spells: [],
    weapons: [],
    armor: { head: 0, leftArm: 0, rightArm: 0, body: 0, leftLeg: 0, rightLeg: 0 },
    equipment: [],
    money: { gold: 0, silver: 0, brass: 0 },
  }),
})
