import type { Page, Locator } from "@playwright/test"

export class WarhammerAdvancementPage {
  constructor(private page: Page) {}

  get careerStatus(): Locator {
    return this.page.locator("text=/COMPLÈTE|EN COURS/")
  }

  get careerCurrent(): Locator {
    return this.page.locator("p:has-text('Carrière') + p")
  }

  get careerHistorySection(): Locator {
    return this.page.getByText("Carrières complétées").locator("..")
  }

  get xpButton25(): Locator { return this.page.getByRole("button", { name: "+25 XP" }) }
  get xpButton50(): Locator { return this.page.getByRole("button", { name: "+50 XP" }) }
  get xpButton100(): Locator { return this.page.getByRole("button", { name: "+100 XP" }) }
  get xpButton200(): Locator { return this.page.getByRole("button", { name: "+200 XP" }) }
  get xpButton500(): Locator { return this.page.getByRole("button", { name: "+500 XP" }) }

  get planSelectTrigger(): Locator {
    return this.page.locator(".select-wrapper button").first()
  }

  get definirButton(): Locator {
    return this.page.getByRole("button", { name: "Définir" })
  }

  private charRow(statLabel: string): Locator {
    const order = ["CC", "CT", "F", "E", "AG", "INT", "FM", "SOC"]
    const idx = order.indexOf(statLabel)
    return this.page
      .locator("h3:has-text('Caractéristiques')")
      .locator("..")
      .locator("div.grid > div")
      .nth(idx)
  }

  charPlusButton(statLabel: string): Locator {
    return this.charRow(statLabel).getByRole("button", { name: "+5" })
  }

  get woundsPlusButton(): Locator {
    return this.page
      .locator("h3:has-text('Blessures')")
      .locator("..")
      .getByRole("button", { name: "+1" })
  }

  get magPlusButton(): Locator {
    return this.page
      .locator("h3:has-text('Magie')")
      .locator("..")
      .getByRole("button", { name: "+1" })
  }

  async earnXp(amount: number) {
    if (amount <= 0) return
    for (const [val, btn] of [[500, this.xpButton500], [200, this.xpButton200], [100, this.xpButton100], [50, this.xpButton50], [25, this.xpButton25]] as const) {
      while (amount >= val) { await btn.click(); amount -= val }
    }
  }

  async clickCharPlus(statLabel: string, times: number) {
    for (let i = 0; i < times; i++) {
      await this.charPlusButton(statLabel).click()
    }
  }

  async clickWoundsPlus(times: number) {
    for (let i = 0; i < times; i++) {
      await this.woundsPlusButton.click()
    }
  }

  async clickMagPlus(times: number) {
    for (let i = 0; i < times; i++) {
      await this.magPlusButton.click()
    }
  }

  async selectPlan(careerName: string) {
    await this.planSelectTrigger.click()
    await this.page.waitForTimeout(200)
    await this.page.locator('[data-testid="select-option"]', { hasText: careerName }).click()
  }

  async clickDefinir() {
    await this.definirButton.click()
    await this.page.waitForTimeout(300)
  }
}
