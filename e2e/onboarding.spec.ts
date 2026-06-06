import { test, expect } from "@playwright/test"
import { buildGenericSeed, seedInitScript } from "./utils"

const CID = "camp-onboard"

test.describe("Onboarding first-launch tour", () => {
  test("shows welcome dialog after creating first character", async ({ page }) => {
    const seed = buildGenericSeed({ id: CID, name: "Aldric" })
    await page.addInitScript(seedInitScript(seed))
    // Override: unset onboarding-seen so the overlay appears
    await page.addInitScript(() => {
      localStorage.removeItem("rpg-player-helper::onboarding-seen")
    })
    await page.goto(`/characters/${CID}/profile`)

    await expect(page.getByText("Premier lancement")).toBeVisible()
    await expect(page.getByText("Bienvenue dans rpg-player-helper")).toBeVisible()
    await expect(page.getByRole("button", { name: "Passer" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Suivant" })).toBeVisible()
  })

  test("can dismiss with Passer button and overlay hides", async ({ page }) => {
    const seed = buildGenericSeed({ id: CID, name: "Aldric" })
    await page.addInitScript(seedInitScript(seed))
    await page.addInitScript(() => {
      localStorage.removeItem("rpg-player-helper::onboarding-seen")
    })
    await page.goto(`/characters/${CID}/profile`)

    await expect(page.getByText("Premier lancement")).toBeVisible()
    await page.getByRole("button", { name: "Passer" }).click()
    await expect(page.getByText("Bienvenue dans rpg-player-helper")).not.toBeVisible()
  })

  test("does not appear after being dismissed", async ({ page }) => {
    const seed = buildGenericSeed({ id: CID, name: "Aldric" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    await expect(page.getByText("Bienvenue dans rpg-player-helper")).not.toBeVisible()
  })
})
