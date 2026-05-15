import { test, expect } from "@playwright/test"
import { buildGenericSeed, buildWarhammerSeed, seedInitScript } from "./utils"

test.describe("Character section navigation", () => {
  test("bottom nav links navigate between sections", async ({ page }) => {
    const seed = buildGenericSeed({ id: "nav-test", name: "Lena" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/nav-test/profile`)

    const bottomNav = page.getByLabel("Navigation principale")
    const links = bottomNav.locator("a")

    await links.filter({ hasText: "Profil" }).click()
    await expect(page).toHaveURL(/\/profile$/)

    await links.filter({ hasText: "Inventaire" }).click()
    await expect(page).toHaveURL(/\/inventory$/)

    await links.filter({ hasText: "Grimoire" }).click()
    await expect(page).toHaveURL(/\/spells$/)

    await links.filter({ hasText: "Compétences" }).click()
    await expect(page).toHaveURL(/\/skills$/)

    await links.filter({ hasText: "Notes" }).click()
    await expect(page).toHaveURL(/\/notes$/)
  })

  test("bottom nav is not shown on the character list page", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("rpg-player-helper::onboarding-seen", "true")
    })
    await page.goto("/characters")
    await expect(page.getByLabel("Navigation principale")).not.toBeVisible()
  })
})

test.describe("Back to home navigation", () => {
  test("header home button navigates to character list", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: "nav-home", name: "Thorgrim" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/nav-home/profile`)

    await page.getByLabel("Retour accueil").click()
    await expect(page).toHaveURL("/characters")
  })

  test("character list card navigates to profile", async ({ page }) => {
    const seed = buildGenericSeed({ id: "nav-card", name: "Elena" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto("/characters")

    await page.locator("article").filter({ hasText: "Elena" }).click()
    await expect(page).toHaveURL(/\/nav-card\/profile$/)
  })
})
