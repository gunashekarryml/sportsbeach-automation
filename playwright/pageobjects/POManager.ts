import { BasePage } from './BasePage';
import { Page } from '@playwright/test';
import { SchedulePage } from './SchedulePage';
import { PartnersPage } from './PartnersPage';

export class POManager {
    basePage: BasePage;
    schedulePage: SchedulePage;
    partnersPage: PartnersPage;
    page: Page;
    

    constructor(page: Page) {
        this.page = page;
        this.basePage = new BasePage(this.page);
        this.schedulePage = new SchedulePage(this.page);
        this.partnersPage = new PartnersPage(this.page);
    }

    getBasePage() {
        return this.basePage;
    }

    getSchedulePage() {
        return this.schedulePage;
    }

    getPartnersPage() {
        return this.partnersPage;
    }

}
module.exports = { POManager };