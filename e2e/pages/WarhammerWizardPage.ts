import type { Page } from "@playwright/test"

export class WarhammerWizardPage {
  constructor(private page: Page) {}

  async fillIdentity(name: string, species: string, career: string) {
    await this.page.getByLabel("Nom").fill(name)

    const wrapper0 = this.page.locator(".select-wrapper").nth(0)
    await wrapper0.locator("button").first().click()
    await this.page.waitForTimeout(200)
    await wrapper0.locator(".select-option", { hasText: species }).click()

    const wrapper1 = this.page.locator(".select-wrapper").nth(1)
    await wrapper1.locator("button").first().click()
    await this.page.waitForTimeout(200)
    await wrapper1.locator(".select-option", { hasText: career }).click()
  }

  async clickNext() {
    await this.page.getByRole("button", { name: "Suivant" }).click()
    await this.page.waitForTimeout(200)
  }

  async spendPoints(stats: number) {
    const plusButtons = this.page.locator('button:has-text("Ajouter 5")')
    for (let i = 0; i < stats; i++) {
      await plusButtons.nth(i).click()
    }
  }

  async budgetRemaining(): Promise<string> {
    return (await this.page.locator("text=/\\d+ \\/ 5 pts/").textContent()) ?? ""
  }

  async clickCreate() {
    await this.page.getByRole("button", { name: "Créer le personnage" }).click()
    await this.page.waitForTimeout(500)
  }
}
