import type { Page, Locator } from "@playwright/test"

export class CharacterListPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/characters")
    await this.page.waitForTimeout(500)
  }

  characterCard(name: string): Locator {
    return this.page.locator("article").filter({ hasText: name })
  }

  async characterBadge(name: string): Promise<string> {
    return this.characterCard(name).locator("span").last().innerText()
  }

  async clickCreateNew() {
    await this.page.getByRole("button", { name: "NOUVEAU HÉROS" }).click()
  }

  async deleteCharacter(name: string) {
    await this.characterCard(name).hover()
    await this.characterCard(name).locator(".campaign-delete-button").click()
  }

  async isCharacterPresent(name: string): Promise<boolean> {
    return this.characterCard(name).isVisible()
  }
}
