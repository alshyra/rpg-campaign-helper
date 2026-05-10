export type StatKey = "dex" | "for" | "con" | "int" | "sag" | "cha";

export interface Stat {
  key: StatKey;
  label: string;
  value: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  value: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  details: string;
  quantity: number;
}

export interface NoteEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Profile {
  characterName: string;
  role: string;
  mood: string;
  injuries: {
    light: number;
    minor: number;
    major: number;
    fatal: number;
  };
}

export interface CharacterState {
  profile: Profile;
  stats: Stat[];
  skills: Skill[];
  inventory: InventoryItem[];
  notes: NoteEntry[];
  updatedAt: string;
}
