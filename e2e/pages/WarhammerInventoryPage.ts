import type { Page, Locator } from "@playwright/test"

export class WarhammerInventoryPage {
  constructor(private page: Page) {}

  async goto(characterId: string) {
    await this.page.goto(`/characters/${characterId}/inventory`)
    await this.page.waitForTimeout(500)
  }

  private moneyInput(field: "gold" | "silver" | "brass"): Locator {
    const idx = { gold: 0, silver: 1, brass: 2 }
    return this.page.locator('article:has-text("Argent") input[type="number"]').nth(idx[field])
  }

  async setMoney(field: "gold" | "silver" | "brass", value: string) {
    await this.moneyInput(field).fill(value)
  }

  get moneyGold(): Locator {
    return this.moneyInput("gold")
  }

  get moneySilver(): Locator {
    return this.moneyInput("silver")
  }

  get moneyBrass(): Locator {
    return this.moneyInput("brass")
  }

  // Equipment
  get equipmentToggle(): Locator {
    return this.page.locator('article:has-text("Équipement")').locator("button").first()
  }

  get equipmentInput(): Locator {
    return this.page.locator("article").filter({ hasText: "Équipement" }).getByRole("textbox")
  }

  get equipmentList(): Locator {
    return this.page.getByTestId("equipment-list")
  }

  get noEquipment(): Locator {
    return this.page.getByTestId("no-equipment")
  }

  get equipmentItem(): Locator {
    return this.page.getByTestId("equipment-item")
  }

  async addEquipmentItem(name: string) {
    await this.equipmentToggle.click()
    await this.equipmentInput.fill(name)
    await this.equipmentInput.press("Enter")
  }

  async removeEquipmentItem(index: number) {
    await this.equipmentList.locator("button").nth(index).click()
  }

  // Weapons
  get weaponToggle(): Locator {
    return this.page.locator('article:has-text("Armes")').locator("button").first()
  }

  get weaponNameInput(): Locator {
    return this.page.locator('input[placeholder="Nom de l\'arme"]')
  }

  get weaponDamageInput(): Locator {
    return this.page.locator('input[placeholder="Dégâts (ex: F+4)"]')
  }

  get weaponQualitiesInput(): Locator {
    return this.page.locator('input[placeholder="Qualités (ex: Tranchant)"]')
  }

  get weaponsList(): Locator {
    return this.page.getByTestId("weapons-list")
  }

  get noWeapons(): Locator {
    return this.page.getByTestId("no-weapons")
  }

  get weaponName(): Locator {
    return this.page.getByTestId("weapon-name")
  }

  get weaponDamage(): Locator {
    return this.page.getByTestId("weapon-damage")
  }

  async addWeapon(name: string, damage: string, qualities: string) {
    await this.weaponToggle.click()
    await this.weaponNameInput.fill(name)
    await this.weaponDamageInput.fill(damage)
    await this.weaponQualitiesInput.fill(qualities)
    await this.page.getByRole("button", { name: "Ajouter" }).click()
  }

  async removeWeapon(index: number) {
    await this.weaponsList.locator("button").nth(index).click()
  }

  // Armor
  get armorInc(): Locator {
    return this.page.getByTestId("armor-inc")
  }

  get armorDec(): Locator {
    return this.page.getByTestId("armor-dec")
  }

  get armorValue(): Locator {
    return this.page.getByTestId("armor-value")
  }

  async adjustArmor(slot: number, delta: number) {
    const btn = delta > 0 ? this.armorInc.nth(slot) : this.armorDec.nth(slot)
    for (let i = 0; i < Math.abs(delta); i++) await btn.click()
  }
}
