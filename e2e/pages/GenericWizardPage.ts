import type { Page } from "@playwright/test"

export class GenericWizardPage {
  constructor(private page: Page) {}

  async fillIdentity(name: string, role: string, mood?: string) {
    await this.page.getByLabel("Nom").fill(name)
    await this.page.getByLabel("Rôle / classe").fill(role)
    if (mood) await this.page.getByLabel("Ambiance").fill(mood)
  }

  async clickNext() {
    await this.page.getByRole("button", { name: "Suivant" }).click()
    await this.page.waitForTimeout(300)
  }

  async adjustStat(label: string, clicks: number) {
    const stepper = this.page.locator(".stat-stepper").filter({ hasText: label })
    const plus = stepper.getByRole("button").last()
    for (let i = 0; i < clicks; i++) await plus.click()
  }

  async clickCreate() {
    await this.page.getByRole("button", { name: "Créer le personnage" }).click()
    await this.page.waitForTimeout(500)
  }
}
