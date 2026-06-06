import type { Page, Locator } from "@playwright/test"

export class GenericInventoryPage {
  constructor(private page: Page) {}

  get addButton(): Locator {
    return this.page.locator("button.rounded-full").first()
  }

  get nameInput(): Locator {
    return this.page.getByPlaceholder("Nom...")
  }

  get detailsInput(): Locator {
    return this.page.getByPlaceholder("Détails")
  }

  get submitButton(): Locator {
    return this.page.getByRole("button", { name: "AJOUTER AU SAC" })
  }

  get emptyState(): Locator {
    return this.page.getByText("Le sac est vide")
  }

  get itemCards(): Locator {
    return this.page.locator("section.grid.gap-3 > div")
  }

  itemName(index: number): Locator {
    return this.itemCards.nth(index).locator("h4")
  }

  itemQuantity(index: number): Locator {
    return this.itemCards.nth(index).locator("span.font-mono")
  }

  itemDecrement(index: number): Locator {
    return this.itemCards.nth(index).locator("button").first()
  }

  itemIncrement(index: number): Locator {
    return this.itemCards.nth(index).locator("button").last()
  }

  async addItem(name: string, details: string = "") {
    await this.addButton.click()
    await this.nameInput.fill(name)
    if (details) await this.detailsInput.fill(details)
    await this.submitButton.click()
  }

  async incrementItem(index: number) {
    await this.itemIncrement(index).click()
  }

  async decrementItem(index: number) {
    await this.itemDecrement(index).click()
  }
}
