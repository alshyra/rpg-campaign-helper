export interface SeedCharacterOptions {
  id?: string
  name?: string
  species?: string
  career?: string
  role?: string
}

interface StoredCampaign {
  id: string
  character: Record<string, unknown>
}

interface StoredState {
  activeCampaignId: string | null
  campaigns: StoredCampaign[]
  updatedAt?: string
}

export interface Seed {
  key: string
  onboardingKey: string
  value: StoredState
}

function baseSeed(id: string, systemId: string, now: string) {
  return {
    key: "rpg-player-helper::campaigns",
    onboardingKey: "rpg-player-helper::onboarding-seen",
    value: {
      activeCampaignId: id,
      campaigns: [
        {
          id,
          character: {
            systemId,
            profile: {
              characterName: "",
              role: "",
              mood: "Déterminé",
              avatarDataUrl: "",
              injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
            },
            systemData: {},
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
            updatedAt: now,
          },
        },
      ],
      updatedAt: now,
    },
  }
}

export function buildGenericSeed(opts: SeedCharacterOptions = {}): Seed {
  const id = opts.id ?? "camp-generic-001"
  const now = new Date().toISOString()
  const seed = baseSeed(id, "generic", now)
  const char = seed.value.campaigns[0].character as Record<string, unknown>
  const profile = char.profile as Record<string, string>
  profile.characterName = opts.name ?? "Aldric"
  profile.role = opts.role ?? "Aventurier"
  char.systemData = {
    stats: [
      { key: "dex", label: "DEX", value: 3 },
      { key: "for", label: "FOR", value: 2 },
      { key: "con", label: "CON", value: 1 },
      { key: "int", label: "INT", value: 0 },
      { key: "sag", label: "SAG", value: 0 },
      { key: "cha", label: "CHA", value: 0 },
    ],
    skills: [],
    inventory: [],
    notes: [],
    spells: [],
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  }
  const sd = char.systemData as Record<string, unknown>
  char.stats = sd.stats
  return seed
}

export function buildWarhammerSeed(opts: SeedCharacterOptions = {}): Seed {
  const id = opts.id ?? "camp-test-001"
  const now = new Date().toISOString()
  const seed = baseSeed(id, "warhammer", now)
  const char = seed.value.campaigns[0].character as Record<string, unknown>
  const profile = char.profile as Record<string, string>
  profile.characterName = opts.name ?? "Gorim"
  profile.role = opts.career ?? "Sorcier"
  char.systemData = {
    species: opts.species ?? "Humain",
    characteristics: {
      base: { ws: 20, bs: 20, s: 20, t: 20, i: 20, ag: 20, dex: 20, int: 20, wp: 20, fel: 20 },
      spent: { ws: 0, bs: 0, s: 0, t: 0, i: 0, ag: 0, dex: 0, int: 0, wp: 0, fel: 0 },
      advancements: { ws: 0, bs: 0, s: 0, t: 0, i: 0, ag: 0, dex: 0, int: 0, wp: 0, fel: 0 },
      current: { ws: 20, bs: 20, s: 20, t: 20, i: 20, ag: 20, dex: 20, int: 20, wp: 20, fel: 20 },
    },
    wounds: { current: 12, max: 12 },
    fate: 2,
    resolve: 2,
    xp: { total: 0, available: 0 },
    career: { current: opts.career ?? "Sorcier", plan: "Sorcier", status: "Argent 1", promotions: 1 },
    skills: {},
    talents: [],
    spells: [],
    weapons: [],
    armor: { head: 0, leftArm: 0, rightArm: 0, body: 0, leftLeg: 0, rightLeg: 0 },
    equipment: [],
    money: { gold: 0, silver: 0, brass: 0 },
  }
  return seed
}

export function buildWarhammerSeedWithData(opts: SeedCharacterOptions & {
  skills?: Record<string, number>
  spells?: Array<{ id: string; name: string; difficulty: string; ingredients: string; description: string }>
  equipment?: string[]
  weapons?: Array<{ name: string; damage: string; qualities: string }>
  money?: { gold: number; silver: number; brass: number }
  wounds?: { current: number; max: number }
  armor?: { head: number; leftArm: number; rightArm: number; body: number; leftLeg: number; rightLeg: number }
} = {}): Seed {
  const seed = buildWarhammerSeed(opts)
  const char = seed.value.campaigns[0].character as any
  const sd = char.systemData
  if (opts.skills) sd.skills = opts.skills
  if (opts.spells) sd.spells = opts.spells
  if (opts.equipment) sd.equipment = opts.equipment
  if (opts.weapons) sd.weapons = opts.weapons
  if (opts.money) sd.money = opts.money
  if (opts.wounds) sd.wounds = opts.wounds
  if (opts.armor) sd.armor = opts.armor
  return seed
}

export function buildGenericSeedWithData(opts: SeedCharacterOptions & {
  skills?: Array<{ id: string; name: string; category: string; value: number }>
  spells?: Array<{ id: string; name: string; school: string; description: string }>
  equipment?: Array<{ id: string; name: string; details: string; quantity: number }>
  notes?: Array<{ id: string; title: string; content: string; createdAt: string }>
  injuries?: { light: number; minor: number; major: number; fatal: number }
} = {}): Seed {
  const seed = buildGenericSeed(opts)
  const char = seed.value.campaigns[0].character as any
  const sd = char.systemData
  if (opts.skills) sd.skills = opts.skills
  if (opts.spells) sd.spells = opts.spells
  if (opts.equipment) sd.equipment = opts.equipment
  if (opts.notes) sd.notes = opts.notes
  if (opts.injuries) sd.injuries = opts.injuries
  char.skills = sd.skills
  char.inventory = sd.equipment ?? []
  char.notes = sd.notes ?? []
  char.spells = sd.spells ?? []
  return seed
}

export function seedInitScript(seed: Seed): string {
  return `
    localStorage.setItem("${seed.onboardingKey}", "true");
    localStorage.setItem("${seed.key}", ${JSON.stringify(JSON.stringify(seed.value))});
  `
}
