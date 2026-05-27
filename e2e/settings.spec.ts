import { test, expect } from "@playwright/test"
import { buildGenericSeed, seedInitScript } from "./utils"

test.describe("Settings view", () => {
  test("shows Drive section and character data section", async ({ page }) => {
    const seed = buildGenericSeed({ id: "settings-char", name: "Kael", role: "Mage" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto("/settings")

    await expect(page.getByText("Synchronisation Google Drive")).toBeVisible()
    await expect(page.getByText("Connecter Google Drive")).toBeVisible()
    await expect(page.getByText("Données de")).toBeVisible()
    await expect(page.getByText("Kael")).toBeVisible()
  })

  test("shows export and delete buttons for active character", async ({ page }) => {
    const seed = buildGenericSeed({ id: "settings-char-b", name: "Elena", role: "Ranger" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto("/settings")

    await expect(page.getByRole("button", { name: "Exporter JSON" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Supprimer ce personnage" })).toBeVisible()
  })
})
