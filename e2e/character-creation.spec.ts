import { test, expect } from "@playwright/test"
import { CharacterCreatePage } from "./pages/CharacterCreatePage"
import { CharacterListPage } from "./pages/CharacterListPage"
import { GenericWizardPage } from "./pages/GenericWizardPage"
import { WarhammerWizardPage } from "./pages/WarhammerWizardPage"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("rpg-player-helper::onboarding-seen", "true")
  })
})

test.describe("Generic system", () => {
  test("creates a character through the full wizard", async ({ page }) => {
    const createPage = new CharacterCreatePage(page)
    const wizard = new GenericWizardPage(page)

    await createPage.goto()
    await createPage.selectSystem("Générique")
    await wizard.fillIdentity("Aldric", "Ranger")
    await wizard.clickNext()
    await wizard.adjustStat("DEX", 3)
    await wizard.adjustStat("FOR", 1)
    await wizard.clickCreate()

    expect(page.url()).toContain("/characters/")
    expect(page.url()).toContain("/profile")
    await expect(page.locator("body")).toContainText("Aldric")
  })

  test("appears in campaign list with generic badge", async ({ page }) => {
    const createPage = new CharacterCreatePage(page)
    const wizard = new GenericWizardPage(page)
    const listPage = new CharacterListPage(page)

    await createPage.goto()
    await createPage.selectSystem("Générique")
    await wizard.fillIdentity("Elena", "Mage")
    await wizard.clickNext()
    await wizard.clickCreate()

    await listPage.goto()
    await expect(page.locator("body")).toContainText("Elena")
    await expect(page.locator("body")).toContainText("Mage")
    await expect(page.locator("body")).toContainText("Générique")
  })
})

test.describe("Deletion", () => {
  test("deletes a character from the campaign list", async ({ page }) => {
    const createPage = new CharacterCreatePage(page)
    const wizard = new GenericWizardPage(page)
    const listPage = new CharacterListPage(page)

    await createPage.goto()
    await createPage.selectSystem("Générique")
    await wizard.fillIdentity("Brom", "Barbare")
    await wizard.clickNext()
    await wizard.clickCreate()

    await listPage.goto()
    await expect(listPage.characterCard("Brom")).toBeVisible()
    await listPage.deleteCharacter("Brom")
    await expect(listPage.characterCard("Brom")).not.toBeVisible()
  })

  test("deleting one character does not affect others", async ({ page }) => {
    const createPage = new CharacterCreatePage(page)
    const genericWizard = new GenericWizardPage(page)
    const warhammerWizard = new WarhammerWizardPage(page)
    const listPage = new CharacterListPage(page)

    await createPage.goto()
    await createPage.selectSystem("Générique")
    await genericWizard.fillIdentity("Kael", "Mage")
    await genericWizard.clickNext()
    await genericWizard.clickCreate()

    await createPage.goto()
    await createPage.selectSystem("Warhammer Fantasy 4e")
    await warhammerWizard.fillIdentity("Zarg", "Orc", "Guerrier", "Berserker")
    await warhammerWizard.spendPoints(5)
    await warhammerWizard.clickCreate()

    await listPage.goto()
    await expect(listPage.characterCard("Kael")).toBeVisible()
    await expect(listPage.characterCard("Zarg")).toBeVisible()

    await listPage.deleteCharacter("Kael")
    await expect(listPage.characterCard("Kael")).not.toBeVisible()
    await expect(listPage.characterCard("Zarg")).toBeVisible()
  })
})

test.describe("Warhammer system", () => {
  test("creates a character through the full wizard", async ({ page }) => {
    const createPage = new CharacterCreatePage(page)
    const wizard = new WarhammerWizardPage(page)

    await createPage.goto()
    await createPage.selectSystem("Warhammer Fantasy 4e")
    await wizard.fillIdentity("Gorim", "Nain", "Guerrier", "Tueur")
    await wizard.spendPoints(5)
    await expect(page.locator("body")).toContainText("0 / 25 pts")
    await wizard.clickCreate()

    expect(page.url()).toContain("/characters/")
    expect(page.url()).toContain("/profile")
    await expect(page.locator("body")).toContainText("Gorim")
    await expect(page.locator("body")).toContainText("Nain")
    await expect(page.locator("body")).toContainText("Guerrier")
  })

  test("appears in campaign list with warhammer badge", async ({ page }) => {
    const createPage = new CharacterCreatePage(page)
    const wizard = new WarhammerWizardPage(page)
    const listPage = new CharacterListPage(page)

    await createPage.goto()
    await createPage.selectSystem("Warhammer Fantasy 4e")
    await wizard.fillIdentity("Thorgrim", "Humain", "Prêtre", "Prêtre guerrier")
    await wizard.spendPoints(5)
    await wizard.clickCreate()

    await listPage.goto()
    await expect(page.locator("body")).toContainText("Thorgrim")
    await expect(page.locator("body")).toContainText("Prêtre")
    await expect(page.locator("body")).toContainText("Warhammer Fantasy 4e")
  })
})
