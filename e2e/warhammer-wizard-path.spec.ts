import { test, expect } from "@playwright/test"
import {
  buildWarhammerSeed,
  seedInitScript,
} from "./utils"
import { WarhammerAdvancementPage } from "./pages/WarhammerAdvancementPage"

const CID = "camp-wizard-path"

test.describe("Wizard career path", () => {
  test("completes full wizard path: Apprentice → Journeyman → Master → Wizard Lord", async ({ page }) => {
    const seed = buildWarhammerSeed({ id: CID, name: "Zalfier", species: "Humain", career: "Apprentice Wizard" })
    await page.addInitScript(seedInitScript(seed))
    await page.goto(`/characters/${CID}/profile`)
    await page.getByRole("button", { name: "Gain de niveau" }).click()
    await page.waitForTimeout(300)
    const adv = new WarhammerAdvancementPage(page)

    await expect(adv.careerCurrent).toContainText("Apprentice Wizard")

    // ---- Apprentice Wizard ----
    // advances: ag+5(1), int+10(2), wp+15(3), fel+5(1), wounds+2(2), mag+1(1) = 10 × 100 = 1000 XP
    await adv.earnXp(1200)
    await adv.clickCharPlus("AG", 1)
    await adv.clickCharPlus("INT", 2)
    await adv.clickCharPlus("FM", 3)
    await adv.clickCharPlus("SOC", 1)
    await adv.clickWoundsPlus(2)
    await adv.clickMagPlus(1)

    await expect(adv.careerStatus).toContainText("COMPLÈTE")

    // Promote: Apprentice → Journeyman (200 XP remaining)
    await adv.selectPlan("Journeyman Wizard")
    await adv.clickDefinir()
    await expect(adv.careerCurrent).toContainText("Journeyman Wizard")

    // ---- Journeyman Wizard (start with ag5, int10, wp15, fel5, wounds2, mag1 carried over) ----
    // Need: ws+5(1), bs+5(1), t+5(1), ag+5(1), int+10(2), wp+10(2), fel+5(1), wounds+1(1), mag+1(1) = 11 × 100 = 1100 XP
    await adv.earnXp(1100)
    await adv.clickCharPlus("CC", 1)
    await adv.clickCharPlus("CT", 1)
    await adv.clickCharPlus("E", 1)
    await adv.clickCharPlus("AG", 1)
    await adv.clickCharPlus("INT", 2)
    await adv.clickCharPlus("FM", 2)
    await adv.clickCharPlus("SOC", 1)
    await adv.clickWoundsPlus(1)
    await adv.clickMagPlus(1)

    await expect(adv.careerStatus).toContainText("COMPLÈTE")

    // Promote: Journeyman → Master (200 XP remaining)
    await adv.selectPlan("Master Wizard")
    await adv.clickDefinir()
    await expect(adv.careerCurrent).toContainText("Master Wizard")

    // ---- Master Wizard (start with ws5, bs5, t5, ag10, int20, wp25, fel10, wounds3, mag2 carried over) ----
    // Need: ws+5(1), bs+5(1), t+5(1), ag+5(1), int+10(2), wp+10(2), fel+5(1), wounds+1(1), mag+1(1) = 11 × 100 = 1100 XP
    await adv.earnXp(1100)
    await adv.clickCharPlus("CC", 1)
    await adv.clickCharPlus("CT", 1)
    await adv.clickCharPlus("E", 1)
    await adv.clickCharPlus("AG", 1)
    await adv.clickCharPlus("INT", 2)
    await adv.clickCharPlus("FM", 2)
    await adv.clickCharPlus("SOC", 1)
    await adv.clickWoundsPlus(1)
    await adv.clickMagPlus(1)

    await expect(adv.careerStatus).toContainText("COMPLÈTE")

    // Promote: Master → Wizard Lord (200 XP remaining)
    await adv.selectPlan("Wizard Lord")
    await adv.clickDefinir()
    await expect(adv.careerCurrent).toContainText("Wizard Lord")

    // ---- Wizard Lord (start with ws10, bs10, t10, ag15, int30, wp35, fel15, wounds4, mag3 carried over) ----
    // Need: ws+5(1), bs+5(1), s+5(1), t+5(1), ag+5(1), int+5(1), wp+5(1), fel+5(1), wounds+1(1), mag+1(1) = 10 × 100 = 1000 XP
    await adv.earnXp(1000)
    await adv.clickCharPlus("CC", 1)
    await adv.clickCharPlus("CT", 1)
    await adv.clickCharPlus("F", 1)
    await adv.clickCharPlus("E", 1)
    await adv.clickCharPlus("AG", 1)
    await adv.clickCharPlus("INT", 1)
    await adv.clickCharPlus("FM", 1)
    await adv.clickCharPlus("SOC", 1)
    await adv.clickWoundsPlus(1)
    await adv.clickMagPlus(1)

    await expect(adv.careerStatus).toContainText("COMPLÈTE")

    // Check career history shows all past careers
    await expect(adv.careerHistorySection).toContainText("Apprentice Wizard")
    await expect(adv.careerHistorySection).toContainText("Journeyman Wizard")
    await expect(adv.careerHistorySection).toContainText("Master Wizard")
  })
})
