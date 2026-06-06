import type { Page, Locator } from "@playwright/test"

export class WarhammerSkillsPage {
  constructor(private page: Page) {}

  get addButton(): Locator {
    return this.page.locator("button.rounded-full").first()
  }

  get nameInput(): Locator {
    return this.page.getByPlaceholder("Ex: Focalisation")
  }

  get valueInput(): Locator {
    return this.page.getByPlaceholder("%")
  }

  get skillCards(): Locator {
    return this.page.locator("div.grid.gap-1 > div")
  }

  skillName(index: number): Locator {
    return this.skillCards.nth(index).locator("span").first()
  }

  deleteButton(index: number): Locator {
    return this.skillCards.nth(index).locator("button").last()
  }

  get emptyState(): Locator {
    return this.page.getByText("Aucune compétence")
  }

  async addSkill(name: string, value: string) {
    await this.addButton.click()
    await this.nameInput.fill(name)
    await this.valueInput.fill(value)
    await this.nameInput.press("Enter")
  }

  async deleteSkill(index: number) {
    await this.deleteButton(index).click()
  }
}
