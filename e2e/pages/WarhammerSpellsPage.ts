import type { Page, Locator } from "@playwright/test"

export class WarhammerSpellsPage {
  constructor(private page: Page) {}

  get addButton(): Locator {
    return this.page.locator("button.rounded-full").first()
  }

  get nameInput(): Locator {
    return this.page.getByPlaceholder("Nom du sort")
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder("Description")
  }

  get difficultyInput(): Locator {
    return this.page.getByPlaceholder("Difficulté")
  }

  get ingredientsInput(): Locator {
    return this.page.getByPlaceholder("Ingrédients")
  }

  get submitButton(): Locator {
    return this.page.getByRole("button", { name: "Ajouter" })
  }

  get spellCards(): Locator {
    return this.page.locator("div.grid.gap-2 > div")
  }

  spellName(index: number): Locator {
    return this.spellCards.nth(index).locator("h4")
  }

  deleteButton(index: number): Locator {
    return this.spellCards.nth(index).locator("button").last()
  }

  get emptyState(): Locator {
    return this.page.getByText("Aucun sort")
  }

  async addSpell(name: string, description: string, difficulty: string = "", ingredients: string = "") {
    await this.addButton.click()
    await this.nameInput.fill(name)
    await this.descriptionInput.fill(description)
    if (difficulty) await this.difficultyInput.fill(difficulty)
    if (ingredients) await this.ingredientsInput.fill(ingredients)
    await this.submitButton.click()
  }

  async deleteSpell(index: number) {
    await this.deleteButton(index).click()
  }
}
