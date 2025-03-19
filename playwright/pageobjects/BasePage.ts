import { Locator, Page } from '@playwright/test';

export class BasePage {
    page: Page;
    letsPartnerLink: Locator;
    scheduleLink: Locator;
    partnersLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.letsPartnerLink = page.locator('role=link[name="Let’s partner!"]');
        this.scheduleLink = page.getByRole('link', { name: 'Schedule', exact: true });
        this.partnersLink = page.getByRole('link', { name: 'Partners', exact: true });
    }

}
    module.exports = { BasePage };