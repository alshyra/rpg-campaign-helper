import { test, expect } from "@playwright/test"

test.describe("Onboarding first-launch tour", () => {
  test("shows welcome dialog on first launch", async ({ page }) => {
    await page.goto("/characters")

    await expect(page.getByText("Premier lancement")).toBeVisible()
    await expect(page.getByText("Bienvenue dans rpg-player-helper")).toBeVisible()
    await expect(page.getByRole("button", { name: "Passer" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Suivant" })).toBeVisible()
  })

  test("progresses through all steps", async ({ page }) => {
    await page.goto("/characters")

    await expect(page.getByText("Bienvenue dans rpg-player-helper")).toBeVisible()

    await page.getByRole("button", { name: "Suivant" }).click()
    await expect(page.getByText("Profil")).toBeVisible()
    await expect(page.getByText("Consulte et modifie en direct")).toBeVisible()

    await page.getByRole("button", { name: "Suivant" }).click()
    await expect(page.getByText("Inventaire")).toBeVisible()

    await page.getByRole("button", { name: "Suivant" }).click()
    await expect(page.getByText("Notes")).toBeVisible()

    await page.getByRole("button", { name: "Suivant" }).click()
    await expect(page.getByText("Sauvegarde")).toBeVisible()

    await expect(page.getByRole("button", { name: "Commencer" })).toBeVisible()
  })

  test("can jump to a specific step via progress dots", async ({ page }) => {
    await page.goto("/characters")

    await page.getByRole("button", { name: "Aller à l'étape 3" }).click()
    await expect(page.getByText("Notes")).toBeVisible()

    await page.getByRole("button", { name: "Aller à l'étape 1" }).click()
    await expect(page.getByText("Profil")).toBeVisible()
  })

  test("dismisses with Passer button", async ({ page }) => {
    await page.goto("/characters")
    await page.getByRole("button", { name: "Passer" }).click()
    await expect(page.getByText("Bienvenue dans rpg-player-helper")).not.toBeVisible()
  })

  test("does not appear after being dismissed", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("rpg-player-helper::onboarding-seen", "true")
    })
    await page.goto("/characters")
    await expect(page.getByText("Bienvenue dans rpg-player-helper")).not.toBeVisible()
  })
})
