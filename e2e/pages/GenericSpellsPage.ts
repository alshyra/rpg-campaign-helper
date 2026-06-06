import type { Page, Locator } from "@playwright/test"

export class GenericSpellsPage {
  constructor(private page: Page) {}

  get addButton(): Locator {
    return this.page.locator("button.rounded-full").first()
  }

  get nameInput(): Locator {
    return this.page.getByLabel("Nom du sort")
  }

  get schoolInput(): Locator {
    return this.page.getByLabel("École de magie")
  }

  get descriptionInput(): Locator {
    return this.page.getByLabel("Description")
  }

  get submitButton(): Locator {
    return this.page.getByRole("button", { name: "AJOUTER AU GRIMOIRE" })
  }

  get updateButton(): Locator {
    return this.page.getByRole("button", { name: "METTRE À JOUR" })
  }

  get emptyState(): Locator {
    return this.page.getByText("Aucun sort")
  }

  get spellCards(): Locator {
    return this.page.locator("div.grid.gap-3 > article")
  }

  spellNameCard(index: number): Locator {
    return this.spellCards.nth(index).locator("h4")
  }

  editButton(index: number): Locator {
    return this.spellCards.nth(index).getByLabel("Modifier le sort")
  }

  deleteButton(index: number): Locator {
    return this.spellCards.nth(index).getByLabel("Supprimer le sort")
  }

  async addSpell(name: string, school: string, description: string) {
    await this.addButton.click()
    await this.nameInput.fill(name)
    await this.schoolInput.fill(school)
    await this.descriptionInput.fill(description)
    await this.submitButton.click()
  }

  async editSpell(index: number, name: string, school: string, description: string) {
    await this.editButton(index).click()
    await this.nameInput.fill(name)
    await this.schoolInput.fill(school)
    await this.descriptionInput.fill(description)
    await this.updateButton.click()
  }

  async deleteSpell(index: number) {
    this.page.once("dialog", (dialog) => dialog.accept())
    await this.deleteButton(index).click()
  }
}
