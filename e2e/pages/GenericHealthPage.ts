import type { Page, Locator } from "@playwright/test"

export class GenericHealthPage {
  constructor(private page: Page) {}

  statusText(text: string): Locator {
    return this.page.getByText(text, { exact: true })
  }

  get healthBoxes(): Locator {
    return this.page.locator("button.health-box")
  }

  tierBoxes(tierLabel: string): Locator {
    return this.page.locator("span").filter({ hasText: tierLabel }).locator("..").locator("button")
  }

  async clickBox(tierLabel: string, index: number) {
    await this.tierBoxes(tierLabel).nth(index).click()
  }

  async clickBoxByIndex(index: number) {
    await this.healthBoxes.nth(index).click()
  }
}
