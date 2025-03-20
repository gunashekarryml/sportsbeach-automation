import { Locator, Page } from '@playwright/test';

export class PartnersPage {
    page: Page;
    mainPartnerName: Locator;
    mainPartnerHeader: Locator;
    mainPartnerDescription: Locator;
    partnerName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainPartnerName = page.locator('//*[@id="main-content"]/div[2]/div[4]/a/div[3]/span');
        this.mainPartnerHeader = page.locator('//*[@id="main-content"]/div[2]/div[4]/a/div[3]/div/h2');
        this.mainPartnerDescription = page.locator('//*[@id="main-content"]/div[2]/div[4]/a/div[3]/div/p');
        this.partnerName = page.locator('//*[@id="main-content"]/div[2]/div[4]/div/a/span');
    }

}
    module.exports = { PartnersPage };