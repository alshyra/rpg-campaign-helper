import type { Page } from "@playwright/test"

export class WarhammerWizardPage {
  constructor(private page: Page) {}

  async fillIdentity(name: string, species: string, career: string, careerPlan?: string) {
    await this.page.getByLabel("Nom").fill(name)
    await this.page.getByLabel("Espèce").fill(species)
    await this.page.getByLabel("Carrière actuelle").fill(career)
    if (careerPlan) await this.page.getByLabel("Plan de carrière").fill(careerPlan)
  }

  async spendPoints(stats: number) {
    const plusButtons = this.page.locator('button:has-text("+5")')
    for (let i = 0; i < stats; i++) {
      await plusButtons.nth(i).click()
    }
  }

  async budgetRemaining(): Promise<string> {
    return (await this.page.locator("text=/\\d+ \\/ 25 pts/").textContent()) ?? ""
  }

  async clickCreate() {
    await this.page.getByRole("button", { name: "Créer le personnage" }).click()
    await this.page.waitForTimeout(500)
  }
}
