import { test, expect } from "@playwright/test"
import { buildGenericSeed, buildGenericSeedWithData, seedInitScript } from "./utils"
import { GenericHealthPage } from "./pages/GenericHealthPage"
import { GenericSkillsPage } from "./pages/GenericSkillsPage"
import { GenericSpellsPage } from "./pages/GenericSpellsPage"
import { GenericNotesPage } from "./pages/GenericNotesPage"
import { GenericInventoryPage } from "./pages/GenericInventoryPage"

const CHARACTER_ID = "camp-generic-test"

test.describe("Generic health", () => {
  test("shows 'INDEMNE' when no injuries", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Borin" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/profile`)
    const health = new GenericHealthPage(page)
    await expect(health.statusText("INDEMNE")).toBeVisible()
  })

  test("progresses through injury tiers", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Borin" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/profile`)
    const health = new GenericHealthPage(page)

    await health.clickBox("Légère", 0)
    await expect(health.statusText("ÉGRATIGNÉ")).toBeVisible()

    await health.clickBox("Moyenne", 0)
    await expect(health.statusText("MAL EN POINT")).toBeVisible()
  })

  test("shows 'MORT' when all 8 slots filled", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Borin" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/profile`)
    const health = new GenericHealthPage(page)

    for (let i = 0; i < 8; i++) {
      await health.clickBoxByIndex(i)
    }
    await expect(health.statusText("AGONISANT / MORT")).toBeVisible()
  })

  test("decrements injury by clicking filled box", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Borin" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/profile`)
    const health = new GenericHealthPage(page)

    await health.clickBox("Légère", 0)
    await expect(health.statusText("ÉGRATIGNÉ")).toBeVisible()

    await health.clickBox("Légère", 0)
    await expect(health.statusText("INDEMNE")).toBeVisible()
  })
})

test.describe("Generic skills", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Lysa" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/skills`)
    const skills = new GenericSkillsPage(page)
    await expect(skills.emptyState).toBeVisible()
  })

  test("adds a skill", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Lysa" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/skills`)
    const skills = new GenericSkillsPage(page)

    await skills.addSkill("Pistage", "Exploration")
    await expect(skills.skillNameCard(0)).toHaveText("Pistage")
  })

  test("edits a skill", async ({ page }) => {
    const seed = buildGenericSeedWithData({
      id: CHARACTER_ID,
      name: "Lysa",
      skills: [{ id: "s1", name: "Pistage", category: "Exploration", value: 2 }],
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/skills`)
    const skills = new GenericSkillsPage(page)

    await skills.editSkill(0, "Furtivité", "Subterfuge")
    await expect(skills.skillNameCard(0)).toHaveText("Furtivité")
  })

  test("deletes a skill with confirmation", async ({ page }) => {
    const seed = buildGenericSeedWithData({
      id: CHARACTER_ID,
      name: "Lysa",
      skills: [{ id: "s1", name: "Pistage", category: "Exploration", value: 2 }],
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/skills`)
    const skills = new GenericSkillsPage(page)

    await expect(skills.skillCards).toHaveCount(1)
    await skills.deleteSkill(0)
    await expect(skills.emptyState).toBeVisible()
  })
})

test.describe("Generic spells", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Mira" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/spells`)
    const spells = new GenericSpellsPage(page)
    await expect(spells.emptyState).toBeVisible()
  })

  test("adds a spell", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Mira" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/spells`)
    const spells = new GenericSpellsPage(page)

    await spells.addSpell("Boule de feu", "Évocation", "Une boule de feu dévastatrice")
    await expect(spells.spellNameCard(0)).toHaveText("Boule de feu")
  })

  test("edits a spell", async ({ page }) => {
    const seed = buildGenericSeedWithData({
      id: CHARACTER_ID,
      name: "Mira",
      spells: [{ id: "sp1", name: "Boule de feu", school: "Évocation", description: "Feu" }],
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/spells`)
    const spells = new GenericSpellsPage(page)

    await spells.editSpell(0, "Éclair", "Invocation", "Un éclair puissant")
    await expect(spells.spellNameCard(0)).toHaveText("Éclair")
  })

  test("deletes a spell with confirmation", async ({ page }) => {
    const seed = buildGenericSeedWithData({
      id: CHARACTER_ID,
      name: "Mira",
      spells: [{ id: "sp1", name: "Boule de feu", school: "Évocation", description: "Feu" }],
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/spells`)
    const spells = new GenericSpellsPage(page)

    await expect(spells.spellCards).toHaveCount(1)
    await spells.deleteSpell(0)
    await expect(spells.emptyState).toBeVisible()
  })
})

test.describe("Generic notes", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Kael" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/notes`)
    const notes = new GenericNotesPage(page)
    await expect(notes.emptyState).toBeVisible()
  })

  test("adds a note", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Kael" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/notes`)
    const notes = new GenericNotesPage(page)

    await notes.addNote("Journal", "Un jour, je serai le meilleur dresseur.")
    await expect(notes.noteTitle(0)).toHaveText("Journal")
  })

  test("deletes a note", async ({ page }) => {
    const seed = buildGenericSeedWithData({
      id: CHARACTER_ID,
      name: "Kael",
      notes: [{ id: "n1", title: "Journal", content: "Jour 1", createdAt: new Date().toISOString() }],
    })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/notes`)
    const notes = new GenericNotesPage(page)

    await expect(notes.noteCards).toHaveCount(1)
    await notes.deleteNote(0)
    await expect(notes.emptyState).toBeVisible()
  })

  test("adds multiple notes (most recent first)", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Kael" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/notes`)
    const notes = new GenericNotesPage(page)

    await notes.addNote("Note 1", "Première note")
    await notes.addNote("Note 2", "Deuxième note")
    await notes.noteTitle(0).waitFor()
    await expect(notes.noteTitle(0)).toHaveText("Note 2")
    await expect(notes.noteTitle(1)).toHaveText("Note 1")
  })
})

test.describe("Generic inventory", () => {
  test("shows empty state", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Thorn" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/inventory`)
    const inv = new GenericInventoryPage(page)
    await expect(inv.emptyState).toBeVisible()
  })

  test("adds an item", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Thorn" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/inventory`)
    const inv = new GenericInventoryPage(page)

    await inv.addItem("Corde", "10m de chanvre")
    await expect(inv.itemName(0)).toHaveText("Corde")
  })

  test("increments item quantity", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Thorn" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/inventory`)
    const inv = new GenericInventoryPage(page)

    await inv.addItem("Ration")
    await expect(inv.itemQuantity(0)).toHaveText("1")
    await inv.incrementItem(0)
    await expect(inv.itemQuantity(0)).toHaveText("2")
  })

  test("decrements item quantity and removes at 1", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Thorn" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/inventory`)
    const inv = new GenericInventoryPage(page)

    await inv.addItem("Ration")
    await inv.incrementItem(0)
    await expect(inv.itemQuantity(0)).toHaveText("2")
    await inv.decrementItem(0)
    await expect(inv.itemQuantity(0)).toHaveText("1")
    await inv.decrementItem(0)
    await expect(inv.emptyState).toBeVisible()
  })

  test("adds multiple items (most recent first)", async ({ page }) => {
    const seed = buildGenericSeed({ id: CHARACTER_ID, name: "Thorn" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CHARACTER_ID}/inventory`)
    const inv = new GenericInventoryPage(page)

    await inv.addItem("Corde")
    await inv.addItem("Ration")
    await inv.addItem("Torche")
    await expect(inv.itemCards).toHaveCount(3)
    await expect(inv.itemName(0)).toHaveText("Torche")
    await expect(inv.itemName(1)).toHaveText("Ration")
    await expect(inv.itemName(2)).toHaveText("Corde")
  })
})
