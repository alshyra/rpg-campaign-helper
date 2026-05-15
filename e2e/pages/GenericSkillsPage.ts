import type { Page, Locator } from "@playwright/test"

export class GenericSkillsPage {
  constructor(private page: Page) {}

  get addButton(): Locator {
    return this.page.locator("button.rounded-full").first()
  }

  get nameInput(): Locator {
    return this.page.getByLabel("Nom")
  }

  get categoryInput(): Locator {
    return this.page.getByLabel("Catégorie")
  }

  get submitButton(): Locator {
    return this.page.getByRole("button", { name: "Ajouter" })
  }

  get updateButton(): Locator {
    return this.page.getByRole("button", { name: "Enregistrer" })
  }

  get cancelButton(): Locator {
    return this.page.getByRole("button", { name: "Annuler" })
  }

  get emptyState(): Locator {
    return this.page.getByText("Aucune compétence")
  }

  get skillCards(): Locator {
    return this.page.locator("section.grid.gap-3 > article")
  }

  skillNameCard(index: number): Locator {
    return this.skillCards.nth(index).locator("h4")
  }

  editButton(index: number): Locator {
    return this.skillCards.nth(index).getByLabel("Modifier la compétence")
  }

  deleteButton(index: number): Locator {
    return this.skillCards.nth(index).getByLabel("Supprimer la compétence")
  }

  async addSkill(name: string, category: string) {
    await this.addButton.click()
    await this.nameInput.fill(name)
    await this.categoryInput.fill(category)
    await this.submitButton.click()
  }

  async editSkill(index: number, name: string, category: string) {
    await this.editButton(index).click()
    await this.nameInput.fill(name)
    await this.categoryInput.fill(category)
    await this.updateButton.click()
  }

  async deleteSkill(index: number) {
    this.page.once("dialog", (dialog) => dialog.accept())
    await this.deleteButton(index).click()
  }
}
