import type { Stat, Skill, InventoryItem, NoteEntry, Spell } from "../../types/character"

export interface Injuries {
  light: number
  minor: number
  major: number
  fatal: number
}

export interface GenericSystemData {
  stats: Stat[]
  skills: Skill[]
  inventory: InventoryItem[]
  notes: NoteEntry[]
  spells: Spell[]
  injuries: Injuries
}
