export interface SeedCharacterOptions {
  id?: string
  name?: string
  species?: string
  career?: string
  role?: string
  plan?: string
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
      base: { ws: 35, bs: 35, s: 35, t: 35, ag: 35, int: 35, wp: 35, fel: 35 },
      spent: { ws: 0, bs: 0, s: 0, t: 0, ag: 0, int: 0, wp: 0, fel: 0 },
      advancements: { ws: 0, bs: 0, s: 0, t: 0, ag: 0, int: 0, wp: 0, fel: 0 },
      current: { ws: 35, bs: 35, s: 35, t: 35, ag: 35, int: 35, wp: 35, fel: 35 },
    },
    wounds: { current: 12, max: 12 },
    woundsAdvancements: 0,
    attacks: 1,
    strengthBonus: 3,
    toughnessBonus: 3,
    movement: 4,
    mag: 0,
    magAdvancements: 0,
    fate: 2,
    insanity: 0,
    xp: { total: 0, available: 0 },
    career: { current: opts.career ?? "Sorcier", plan: opts.plan ?? "", status: "Argent 1", promotions: 1 },
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

export function buildAureliusSeed(): Seed {
  return buildWarhammerSeedWithData({
    name: "Aurélius Lebaro",
    career: "Sorcier de village",
    wounds: { current: 12, max: 12 },
    money: { gold: 0, silver: 8, brass: 0 },
    equipment: [
      "Besace", "Bourse", "Épingle (x3)", "Morceau de silex",
      "Plume (x3)", "Poignée de sable (x3)",
    ],
    weapons: [
      { name: "Arme à une main", damage: "BF", qualities: "" },
      { name: "Dague", damage: "BF-3", qualities: "" },
    ],
    armor: { head: 0, leftArm: 0, rightArm: 0, body: 0, leftLeg: 0, rightLeg: 0 },
    skills: {
      Canotage: 20, Charisme: 40, Commandement: 20, Commérage: 40,
      "Conduite d'attelages": 20, "Connaissances générales (Empire)": 45,
      Déguisement: 20, "Déplacement silencieux": 20, Dissimulation: 20,
      Équitation: 20, Escalade: 20, Évaluation: 23, Focalisation: 50,
      Fouille: 45, Intimidation: 20, Jeu: 23, "Langue (reikspiel)": 45,
      Marchandage: 20, "Métier (apothicaire)": 45, Natation: 20,
      Perception: 45, "Résistance à l'alcool": 20, "Sens de la magie": 50,
      "Soins des animaux": 45, Soins: 45, Survie: 23,
    },
    spells: [
      { id: "spell-1", name: "Choc", difficulty: "6", ingredients: "Une petite épingle", description: "" },
      { id: "spell-2", name: "Flammerole", difficulty: "3", ingredients: "Un morceau de silex", description: "" },
      { id: "spell-3", name: "Mauvaise fortune", difficulty: "5", ingredients: "Poupée représentant la victime", description: "" },
      { id: "spell-4", name: "Pare-pluie", difficulty: "3", ingredients: "Une feuille fraichement cueillie", description: "" },
      { id: "spell-5", name: "Rafale", difficulty: "4", ingredients: "Une plume d'oiseau", description: "" },
      { id: "spell-6", name: "Sillage spectral", difficulty: "4", ingredients: "Une pincée de sable", description: "" },
    ],
  })
}

export function seedInitScript(seed: Seed): string {
  return `
    localStorage.setItem("${seed.onboardingKey}", "true");
    localStorage.setItem("${seed.key}", ${JSON.stringify(JSON.stringify(seed.value))});
  `
}
