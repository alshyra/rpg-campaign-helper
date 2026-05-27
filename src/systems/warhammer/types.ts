export type CharacteristicKey = "ws" | "bs" | "s" | "t" | "ag" | "int" | "wp" | "fel";

export const CHARACTERISTICS: { key: CharacteristicKey; label: string }[] = [
  { key: "ws", label: "CC" },
  { key: "bs", label: "CT" },
  { key: "s", label: "F" },
  { key: "t", label: "E" },
  { key: "ag", label: "AG" },
  { key: "int", label: "INT" },
  { key: "wp", label: "FM" },
  { key: "fel", label: "SOC" },
];

export interface Characteristics {
  ws: number;
  bs: number;
  s: number;
  t: number;
  ag: number;
  int: number;
  wp: number;
  fel: number;
}

export function makeBlankCharacteristics(): Characteristics {
  return { ws: 0, bs: 0, s: 0, t: 0, ag: 0, int: 0, wp: 0, fel: 0 };
}

export function cloneCharacteristics(c: Characteristics): Characteristics {
  return { ...c };
}

export function computeCurrent(
  base: Characteristics,
  spent: Characteristics,
  advancements: Characteristics,
): Characteristics {
  const keys: CharacteristicKey[] = ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"];
  const result = makeBlankCharacteristics();
  for (const k of keys) result[k] = base[k] + spent[k] + advancements[k];
  return result;
}

export const HUMAN_BASE: Characteristics = {
  ws: 35,
  bs: 35,
  s: 35,
  t: 35,
  ag: 35,
  int: 35,
  wp: 35,
  fel: 35,
};

export const SPENT_MAX = 10;
export const BUDGET_TOTAL = 45;
export const STEP = 5;

export function computeBonus(value: number): number {
  return Math.floor(value / 10);
}

export interface WfrpSpell {
  id: string;
  name: string;
  description: string;
  difficulty?: string;
  ingredients?: string;
  incantation?: string;
  range?: string;
  target?: string;
  duration?: string;
}

export interface WfrpWeapon {
  id: string;
  name: string;
  damage: string;
  range?: string;
  qualities: string;
}

export interface WfrpArmor {
  head: number;
  leftArm: number;
  rightArm: number;
  body: number;
  leftLeg: number;
  rightLeg: number;
}

export interface WfrpSystemData {
  species: string;
  characteristics: {
    base: Characteristics;
    spent: Characteristics;
    advancements: Characteristics;
    current: Characteristics;
  };
  wounds: { current: number; max: number };
  woundsAdvancements: number;
  attacks: number;
  strengthBonus: number;
  toughnessBonus: number;
  movement: number;
  mag: number;
  magAdvancements: number;
  fate: number;
  insanity: number;
  xp: { total: number; available: number };
  career: { current: string; plan: string; status: string; promotions: number; history: string[] };
  skills: Record<string, number>;
  talents: string[];
  spells: WfrpSpell[];
  weapons: WfrpWeapon[];
  armor: WfrpArmor;
  equipment: string[];
  money: { gold: number; silver: number; brass: number };
}
