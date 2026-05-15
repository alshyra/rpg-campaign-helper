import { test, expect } from "@playwright/test"
import {
  buildWarhammerSeed,
  buildWarhammerSeedWithData,
  seedInitScript,
} from "./utils"
import { WarhammerProfilePage } from "./pages/WarhammerProfilePage"
import { WarhammerHealthPage } from "./pages/WarhammerHealthPage"
import { WarhammerSkillsPage } from "./pages/WarhammerSkillsPage"
import { WarhammerSpellsPage } from "./pages/WarhammerSpellsPage"
import { WarhammerNotesPage } from "./pages/WarhammerNotesPage"

const CID = "camp-wfrp-test"

test.describe("Warhammer profile (read-only)", () => {
  test("displays character name and species/career", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Grom", species: "Nain", career: "Guerrier" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    const profile = new WarhammerProfilePage(page)
    await expect(profile.characterName).toHaveText("Grom")
    await expect(profile.speciesCareer).toContainText("Nain")
    await expect(profile.speciesCareer).toContainText("Guerrier")
  })

  test("displays XP information", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Grom" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    const profile = new WarhammerProfilePage(page)
    await expect(profile.woundsDisplay).toBeVisible()
    await expect(profile.xpDisplay).toBeVisible()
  })
})

test.describe("Warhammer health", () => {
  test("shows wounds value from seed", async ({ page }) => {
    const seed = buildWarhammerSeedWithData({
      id: CID,
      name: "Ulfgar",
      wounds: { current: 14, max: 14 },
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    const health = new WarhammerHealthPage(page)
    await expect(health.woundsDisplay).toContainText("14")
  })

  test("increments current wounds", async ({ page }) => {
    const seed = buildWarhammerSeedWithData({
      id: CID,
      name: "Ulfgar",
      wounds: { current: 12, max: 12 },
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    const health = new WarhammerHealthPage(page)

    await health.decrementCurrent()
    await expect(health.woundsDisplay).toContainText("11")
    await health.incrementCurrent()
    await expect(health.woundsDisplay).toContainText("12")
  })

  test("increments max wounds", async ({ page }) => {
    const seed = buildWarhammerSeedWithData({
      id: CID,
      name: "Ulfgar",
      wounds: { current: 10, max: 10 },
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    const health = new WarhammerHealthPage(page)

    await health.incrementMax()
    await expect(health.woundsDisplay).toContainText("11")
  })
})

test.describe("Warhammer skills", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Ragnar" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/skills`)
    const skills = new WarhammerSkillsPage(page)
    await expect(skills.emptyState).toBeVisible()
  })

  test("adds a skill", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Ragnar" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/skills`)
    const skills = new WarhammerSkillsPage(page)

    await skills.addSkill("Focalisation", "30")
    await expect(skills.skillName(0)).toHaveText("Focalisation")
  })

  test("deletes a skill", async ({ page }) => {
    const seed = buildWarhammerSeedWithData({
      id: CID,
      name: "Ragnar",
      skills: { Escalade: 20, Natation: 15 },
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/skills`)
    const skills = new WarhammerSkillsPage(page)

    await expect(skills.skillCards).toHaveCount(2)
    await skills.deleteSkill(0)
    await expect(skills.skillCards).toHaveCount(1)
  })
})

test.describe("Warhammer spells", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Zarat" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/spells`)
    const spells = new WarhammerSpellsPage(page)
    await expect(spells.emptyState).toBeVisible()
  })

  test("adds a spell", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Zarat" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/spells`)
    const spells = new WarhammerSpellsPage(page)

    await spells.addSpell("Vent du feu", "Une flamme jaillit", "Moyenne", "Soufre")
    await expect(spells.spellName(0)).toHaveText("Vent du feu")
  })

  test("deletes a spell", async ({ page }) => {
    const seed = buildWarhammerSeedWithData({
      id: CID,
      name: "Zarat",
      spells: [{ id: "sp1", name: "Vent du feu", difficulty: "Moyenne", ingredients: "Soufre", description: "Feu" }],
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/spells`)
    const spells = new WarhammerSpellsPage(page)

    await expect(spells.spellCards).toHaveCount(1)
    await spells.deleteSpell(0)
    await expect(spells.emptyState).toBeVisible()
  })
})

test.describe("Warhammer notes", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Sigmar" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/notes`)
    const notes = new WarhammerNotesPage(page)
    await expect(notes.emptyState).toBeVisible()
  })

  test("adds a note", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Sigmar" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/notes`)
    const notes = new WarhammerNotesPage(page)

    await notes.addNote("Météo", "Temps clair sur le Vieux Monde")
    await expect(notes.noteTitle(0)).toHaveText("Météo")
  })

  test("deletes a note", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Sigmar" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/notes`)
    const notes = new WarhammerNotesPage(page)

    await notes.addNote("Journal", "Jour 1")
    await notes.deleteNote(0)
    await expect(notes.emptyState).toBeVisible()
  })
})
