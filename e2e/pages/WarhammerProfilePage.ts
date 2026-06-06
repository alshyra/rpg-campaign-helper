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
    return this.page.locator("span").filter({ hasText: /^(CC|CT|F|E|AG|INT|FM|SOC)$/ })
  }

  characteristicValue(label: string): Locator {
    return this.page.locator(`xpath=//div[contains(@class,'rounded-lg') and .//text()='${label}']/div[contains(@class,'text-lg')]`)
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

  get careerPlan(): Locator {
    return this.page.getByText(/^Plan :/).first()
  }

  get careerStatus(): Locator {
    return this.page.getByText(/^Statut :/).first()
  }

  get careerPromotions(): Locator {
    return this.page.getByText(/^Échelons :/).first()
  }

  get insanityDisplay(): Locator {
    return this.page.getByText("Folie")
  }

  get fateDisplay(): Locator {
    return this.page.getByText("Destin")
  }

  characteristicValueLabel(label: string): Locator {
    return this.page.locator(`text="${label}"`).first()
  }
}
