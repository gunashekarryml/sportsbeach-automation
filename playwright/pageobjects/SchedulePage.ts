import { Locator, Page } from '@playwright/test';

export class SchedulePage {
    page: Page;
    standaloneHeader: Locator;
    standaloneDescription: Locator;
    standalonePreviousSlideButton: Locator;
    standaloneNextSlideButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.standaloneHeader = page.locator('//*[@id="main-content"]/div[4]/div[1]/h2');
        this.standaloneDescription = page.locator('//*[@id="main-content"]/div[4]/p/text()');
        this.standalonePreviousSlideButton = page.locator('//*[@id="main-content"]/div[4]/div[2]/div[2]/div[2]/button[1]');
        this.standaloneNextSlideButton = page.locator('//*[@id="main-content"]/div[4]/div[2]/div[2]/div[2]/button[1]');
    }

}
    module.exports = { SchedulePage };