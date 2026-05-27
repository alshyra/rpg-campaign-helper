import type { Page, Locator } from "@playwright/test"

export class WarhammerHealthPage {
  constructor(private page: Page) {}

  get woundsDisplay(): Locator {
    return this.page.locator("span.font-mono.font-black.text-white\\/10")
  }

  get currentWoundsDec(): Locator {
    return this.page.getByLabel("Diminuer Actuelles")
  }

  get currentWoundsInc(): Locator {
    return this.page.getByLabel("Augmenter Actuelles")
  }

  async incrementCurrent() {
    await this.currentWoundsInc.click()
  }

  async decrementCurrent() {
    await this.currentWoundsDec.click()
  }

  get fateInc(): Locator {
    return this.page.getByLabel("Augmenter Destin")
  }

  get insanityInc(): Locator {
    return this.page.getByLabel("Augmenter Folie")
  }
}
