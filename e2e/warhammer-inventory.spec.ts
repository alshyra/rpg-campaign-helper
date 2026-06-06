import { test, expect } from "@playwright/test"
import { buildWarhammerSeed, seedInitScript } from "./utils"
import { WarhammerInventoryPage } from "./pages/WarhammerInventoryPage"

const seed = buildWarhammerSeed({ name: "Gorim Pickaxe", career: "Chercheur de ruines" })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(seedInitScript(seed))
  const inventoryPage = new WarhammerInventoryPage(page)
  await inventoryPage.goto("camp-test-001")
})

test.describe("Money", () => {
  test("edits gold value", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.setMoney("gold", "150")
    await expect(ip.moneyGold).toHaveValue("150")
  })

  test("edits silver value", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.setMoney("silver", "40")
    await expect(ip.moneySilver).toHaveValue("40")
  })

  test("edits brass value", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.setMoney("brass", "99")
    await expect(ip.moneyBrass).toHaveValue("99")
  })

  test("rejects negative money values in store", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.setMoney("gold", "-50")

    const gold = await page.evaluate(() => {
      const raw = localStorage.getItem("rpg-player-helper::campaigns")
      if (!raw) return null
      return JSON.parse(raw).campaigns[0].character.systemData.money.gold
    })
    expect(gold).toBe(0)
  })
})

test.describe("Equipment", () => {
  test("shows empty state when no equipment", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await expect(ip.noEquipment).toBeVisible()
  })

  test("adds an equipment item", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.addEquipmentItem("Corde de 10m")
    await expect(ip.equipmentList).toBeVisible()
    await expect(ip.equipmentItem).toHaveText("Corde de 10m")
  })

  test("removes an equipment item", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.addEquipmentItem("Corde")
    await ip.removeEquipmentItem(0)
    await expect(ip.noEquipment).toBeVisible()
  })

  test("adds multiple equipment items (most recent first)", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    for (const item of ["Corde", "Rations", "Torche"]) {
      await ip.addEquipmentItem(item)
    }
    await expect(ip.equipmentItem).toHaveCount(3)
    await expect(ip.equipmentItem.nth(0)).toHaveText("Torche")
    await expect(ip.equipmentItem.nth(1)).toHaveText("Rations")
    await expect(ip.equipmentItem.nth(2)).toHaveText("Corde")
  })
})

test.describe("Weapons", () => {
  test("shows empty state when no weapons", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await expect(ip.noWeapons).toBeVisible()
  })

  test("adds a weapon with name, damage and qualities", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.addWeapon("Épée longue", "F+4", "Tranchant")
    await expect(ip.weaponsList).toBeVisible()
    await expect(ip.weaponName).toHaveText("Épée longue")
    await expect(ip.weaponDamage).toHaveText("F+4 · Tranchant")
  })

  test("removes a weapon", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.addWeapon("Dague", "F+2", "Perforant")
    await ip.removeWeapon(0)
    await expect(ip.noWeapons).toBeVisible()
  })

  test("does not add a weapon without a name", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.weaponToggle.click()
    await page.getByRole("button", { name: "Ajouter" }).click()
    await expect(ip.noWeapons).toBeVisible()
  })
})

test.describe("Armor", () => {
  test("displays all six hit locations at zero", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await expect(ip.armorValue).toHaveCount(6)
    for (let i = 0; i < 6; i++) {
      await expect(ip.armorValue.nth(i)).toHaveText("0")
    }
  })

  test("increments armor value", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.adjustArmor(0, 1)
    await expect(ip.armorValue.nth(0)).toHaveText("1")
    await ip.adjustArmor(2, 2)
    await expect(ip.armorValue.nth(2)).toHaveText("2")
  })

  test("decrements armor value", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.adjustArmor(0, 3)
    await ip.adjustArmor(0, -1)
    await expect(ip.armorValue.nth(0)).toHaveText("2")
  })

  test("cannot decrement below zero", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await expect(ip.armorDec.nth(0)).toBeDisabled()
  })

  test("cannot increment above 10", async ({ page }) => {
    const ip = new WarhammerInventoryPage(page)
    await ip.adjustArmor(0, 10)
    await expect(ip.armorValue.nth(0)).toHaveText("10")
    await expect(ip.armorInc.nth(0)).toBeDisabled()
  })
})
