import type { Page, Locator } from "@playwright/test"

export class WarhammerHealthPage {
  constructor(private page: Page) {}

  get woundsDisplay(): Locator {
    return this.page.locator("span.font-mono.font-black")
  }

  get currentWoundsDec(): Locator {
    return this.page.getByLabel("Diminuer Actuelles")
  }

  get currentWoundsInc(): Locator {
    return this.page.getByLabel("Augmenter Actuelles")
  }

  get maxWoundsDec(): Locator {
    return this.page.getByLabel("Diminuer Maximum")
  }

  get maxWoundsInc(): Locator {
    return this.page.getByLabel("Augmenter Maximum")
  }

  async incrementCurrent() {
    await this.currentWoundsInc.click()
  }

  async decrementCurrent() {
    await this.currentWoundsDec.click()
  }

  async incrementMax() {
    await this.maxWoundsInc.click()
  }

  async decrementMax() {
    await this.maxWoundsDec.click()
  }
}
