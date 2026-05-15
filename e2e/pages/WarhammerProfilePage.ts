import type { Page, Locator } from "@playwright/test"

export class WarhammerProfilePage {
  constructor(private page: Page) {}

  get characterName(): Locator {
    return this.page.locator("h2")
  }

  get speciesCareer(): Locator {
    return this.page.locator("p").filter({ hasText: /Humain|Nain|Elfe/ })
  }

  get characteristicLabels(): Locator {
    return this.page.locator("span").filter({ hasText: /^(CC|CT|F|E|I|Ag|Dex|Int|FM|Soc)$/ })
  }

  characteristicValue(label: string): Locator {
    return this.page.locator(`xpath=//span[text()="${label}"]/following-sibling::span[1]`)
  }

  get moneyGold(): Locator {
    return this.page.locator("span").filter({ hasText: "PO" })
  }

  get moneySilver(): Locator {
    return this.page.locator("span").filter({ hasText: "PA" })
  }

  get moneyBrass(): Locator {
    return this.page.locator("span").filter({ hasText: "PC" })
  }

  get woundsDisplay(): Locator {
    return this.page.locator("span.font-mono.font-black").first()
  }

  get xpDisplay(): Locator {
    return this.page.getByText("XP total")
  }
}
