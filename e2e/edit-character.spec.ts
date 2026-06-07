import { test, expect } from "@playwright/test"
import { buildGenericSeed, buildWarhammerSeed, seedInitScript } from "./utils"

test.describe("Character editing", () => {
  test("edit route opens wizard with pre-filled data for Generic system", async ({ page }) => {
    const seed = buildGenericSeed({ id: "edit-gen-001", name: "Aldric", role: "Ranger" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto("/characters/edit-gen-001/edit")

    await expect(page.getByLabel("Nom")).toHaveValue("Aldric")
    await expect(page.getByLabel("Rôle / classe")).toHaveValue("Ranger")
    await expect(page.getByRole("button", { name: "Suivant" })).toBeVisible()
  })

  test("modifying name through wizard and saving redirects to profile", async ({ page }) => {
    const seed = buildGenericSeed({ id: "edit-gen-002", name: "Borin", role: "Guerrier" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto("/characters/edit-gen-002/edit")

    await page.getByLabel("Nom").fill("Borin le Brave")
    await page.getByRole("button", { name: "Suivant" }).click()
    await page.getByRole("button", { name: "Enregistrer" }).click()

    await expect(page).toHaveURL(/\/characters\/edit-gen-002\/profile$/)
    await expect(page.locator("body")).toContainText("Borin le Brave")
  })

  test("edit route opens Wizard for Warhammer system", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: "edit-wh-001", name: "Gorim", species: "Nain", career: "Agitator" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto("/characters/edit-wh-001/edit")

    await expect(page.getByLabel("Nom")).toHaveValue("Gorim")
    await expect(page.locator("body")).toContainText("Agitator")
  })
})
