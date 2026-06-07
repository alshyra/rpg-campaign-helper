import type { Characteristics } from "./types";

export interface WfrpCareerSecondary {
  attacks: number;
  wounds: number;
  mag: number;
}

export interface WfrpCareerData {
  type: "basic" | "advanced";
  role: string;
  advances: Characteristics;
  secondary: WfrpCareerSecondary;
  entries: string[];
  exits: string[];
}

import CAREER_DATA_BASIC_RAW from "./careers-data-basic.json";
import CAREER_DATA_ADVANCED_RAW from "./careers-data-advanced.json";

export const CAREER_DATA: Record<string, WfrpCareerData> = {
  ...CAREER_DATA_BASIC_RAW,
  ...CAREER_DATA_ADVANCED_RAW,
};

export function getCareerData(name: string): WfrpCareerData | undefined {
  return CAREER_DATA[name];
}

export function getAllCareerNames(): string[] {
  return Object.keys(CAREER_DATA).sort();
}

export function getBasicCareerNames(): string[] {
  return Object.keys(CAREER_DATA_BASIC_RAW).sort();
}
