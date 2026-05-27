import { test, expect } from "@playwright/test"
import { buildAureliusSeed, seedInitScript } from "./utils"
import { WarhammerProfilePage } from "./pages/WarhammerProfilePage"
import { WarhammerHealthPage } from "./pages/WarhammerHealthPage"

const seed = buildAureliusSeed()

test.beforeEach(async ({ page }) => {
  await page.addInitScript(seedInitScript(seed))
})

test("Aurélius profile matches the character sheet", async ({ page }) => {
  await page.goto("/characters/camp-test-001/profile")

  const profile = new WarhammerProfilePage(page)

  await expect(profile.characterName).toContainText("Aurélius Lebaro")
  await expect(profile.speciesCareer).toContainText("Sorcier de village")
  await expect(profile.speciesCareer).toContainText("Humain")
})

test("Aurélius characteristics are present", async ({ page }) => {
  await page.goto("/characters/camp-test-001/profile")

  const profile = new WarhammerProfilePage(page)

  await expect(profile.characteristicValue("CC")).toBeVisible()
  await expect(profile.characteristicValue("CT")).toBeVisible()
  await expect(profile.characteristicValue("F")).toBeVisible()
  await expect(profile.characteristicValue("E")).toBeVisible()
  await expect(profile.characteristicValue("AG")).toBeVisible()
  await expect(profile.characteristicValue("INT")).toBeVisible()
  await expect(profile.characteristicValue("FM")).toBeVisible()
  await expect(profile.characteristicValue("SOC")).toBeVisible()
})

test("Aurélius has correct equipment and money", async ({ page }) => {
  await page.goto("/characters/camp-test-001/profile")

  const profile = new WarhammerProfilePage(page)

  await expect(profile.moneyGold).toBeVisible()
  await expect(profile.moneySilver).toBeVisible()
  await expect(profile.moneyBrass).toBeVisible()
  await expect(page.getByText("Besace")).toBeVisible()
  await expect(page.getByText("Bourse")).toBeVisible()
})

test("Aurélius health page shows wounds, destin and folie", async ({ page }) => {
  await page.goto("/characters/camp-test-001/profile")

  const health = new WarhammerHealthPage(page)

  await expect(health.woundsDisplay.first()).toContainText("12/12")
  await expect(health.fateInc).toBeVisible()
  await expect(health.insanityInc).toBeVisible()
})
