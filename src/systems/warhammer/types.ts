export type CharacteristicKey =
  | "ws" | "bs" | "s" | "t" | "i"
  | "ag" | "dex" | "int" | "wp" | "fel"

export const CHARACTERISTICS: { key: CharacteristicKey; label: string }[] = [
  { key: "ws", label: "CC" },
  { key: "bs", label: "CT" },
  { key: "s", label: "F" },
  { key: "t", label: "E" },
  { key: "i", label: "I" },
  { key: "ag", label: "AG" },
  { key: "dex", label: "DEX" },
  { key: "int", label: "INT" },
  { key: "wp", label: "FM" },
  { key: "fel", label: "SOC" },
]

export interface Characteristics {
  ws: number; bs: number; s: number; t: number; i: number
  ag: number; dex: number; int: number; wp: number; fel: number
}

export function makeBlankCharacteristics(): Characteristics {
  return { ws: 0, bs: 0, s: 0, t: 0, i: 0, ag: 0, dex: 0, int: 0, wp: 0, fel: 0 }
}

export function cloneCharacteristics(c: Characteristics): Characteristics {
  return { ...c }
}

export function computeCurrent(base: Characteristics, spent: Characteristics, advancements: Characteristics): Characteristics {
  const keys: CharacteristicKey[] = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"]
  const result = makeBlankCharacteristics()
  for (const k of keys) result[k] = base[k] + spent[k] + advancements[k]
  return result
}

export const HUMAN_BASE: Characteristics = {
  ws: 20, bs: 20, s: 20, t: 20, i: 20,
  ag: 20, dex: 20, int: 20, wp: 20, fel: 20,
}

export const SPENT_MAX = 10
export const BUDGET_TOTAL = 25
export const STEP = 5

export interface WfrpSpell {
  id: string
  name: string
  description: string
  difficulty?: string
  ingredients?: string
  incantation?: string
  range?: string
  target?: string
  duration?: string
}

export interface WfrpWeapon {
  id: string
  name: string
  damage: string
  range?: string
  qualities: string
}

export interface WfrpArmor {
  head: number
  leftArm: number
  rightArm: number
  body: number
  leftLeg: number
  rightLeg: number
}

export interface WfrpSystemData {
  species: string
  characteristics: {
    base: Characteristics
    spent: Characteristics
    advancements: Characteristics
    current: Characteristics
  }
  wounds: { current: number; max: number }
  fate: number
  resolve: number
  xp: { total: number; available: number }
  career: { current: string; plan: string; status: string; promotions: number }
  skills: Record<string, number>
  talents: string[]
  spells: WfrpSpell[]
  weapons: WfrpWeapon[]
  armor: WfrpArmor
  equipment: string[]
  money: { gold: number; silver: number; brass: number }
}
