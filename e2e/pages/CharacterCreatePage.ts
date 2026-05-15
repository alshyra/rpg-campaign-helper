import type { Page } from "@playwright/test"

export class CharacterCreatePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/characters/create")
    await this.page.waitForTimeout(500)
  }

  async selectSystem(name: string) {
    await this.page.getByRole("button").filter({ hasText: name }).click()
    await this.page.waitForTimeout(300)
  }
}
