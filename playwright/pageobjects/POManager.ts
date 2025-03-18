import { BasePage } from './BasePage';
import { Page } from '@playwright/test';
import { SchedulePage } from './SchedulePage';

export class POManager {
    basePage: BasePage;
    schedulePage: SchedulePage;
    page: Page;
    

    constructor(page: Page) {
        this.page = page;
        this.basePage = new BasePage(this.page);
        this.schedulePage = new SchedulePage(this.page);
    }

    getBasePage() {
        return this.basePage;
    }

    getSchedulePage() {
        return this.schedulePage;
    }

}
module.exports = { POManager };