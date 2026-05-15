import type { Page, Locator } from "@playwright/test"

export class WarhammerNotesPage {
  constructor(private page: Page) {}

  get addButton(): Locator {
    return this.page.locator("button.rounded-full").first()
  }

  get titleInput(): Locator {
    return this.page.getByPlaceholder("Titre")
  }

  get contentInput(): Locator {
    return this.page.getByPlaceholder("Contenu")
  }

  get submitButton(): Locator {
    return this.page.getByRole("button", { name: "Ajouter" })
  }

  get noteCards(): Locator {
    return this.page.locator("article.rounded-2xl")
  }

  noteTitle(index: number): Locator {
    return this.noteCards.nth(index).locator("h4")
  }

  noteContent(index: number): Locator {
    return this.noteCards.nth(index).locator("p").last()
  }

  deleteButton(index: number): Locator {
    return this.noteCards.nth(index).locator("button").last()
  }

  get emptyState(): Locator {
    return this.page.getByText("Aucune note")
  }

  async addNote(title: string, content: string) {
    await this.addButton.click()
    await this.titleInput.fill(title)
    await this.contentInput.fill(content)
    await this.submitButton.click()
  }

  async deleteNote(index: number) {
    await this.deleteButton(index).click()
  }
}
