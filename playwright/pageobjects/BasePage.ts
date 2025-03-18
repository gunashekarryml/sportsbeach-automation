import { Locator, Page } from '@playwright/test';

export class BasePage {
    page: Page;
    letsPartnerLink: Locator;
    scheduleLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.letsPartnerLink = page.locator('role=link[name="Let’s partner!"]');
        this.scheduleLink = page.getByRole('link', { name: 'Schedule', exact: true });
    }

}
    module.exports = { BasePage };