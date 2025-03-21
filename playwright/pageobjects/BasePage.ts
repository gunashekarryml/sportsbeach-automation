import { Locator, Page } from '@playwright/test';

export class BasePage {
    page: Page;
    requestPassLink: Locator;
    scheduleLink: Locator;
    partnersLink: Locator;
    closePopup: Locator;
    featured1UPAnimation: Locator;
    acceptCookies: Locator;
    letsPartnerButton: Locator;

    // Social Media Links Locators
    instagramLink: Locator;
    xProfileLink: Locator;
    linkedInLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.requestPassLink = page.locator('//*[@id="__next"]/header/a/span');
        this.scheduleLink = page.getByRole('link', { name: 'Schedule', exact: true });
        this.partnersLink = page.getByRole('link', { name: 'Partners', exact: true });
        this.closePopup = page.getByRole('button', { name: 'Close Alert Pop Up' });
        this.featured1UPAnimation = page.locator('//*[@id="main-content"]/div[4]/div[4]/div[1]/a/div');
        this.acceptCookies = page.getByRole('button', { name: 'Accept cookies' });
        this.letsPartnerButton = page.locator('//div[@class="flex gap-6 fill-white text-white lg:gap-4"]');

        // Define locators for social media links
        this.instagramLink = page.locator('a[aria-label="Visit Instagram"]');
        this.xProfileLink = page.locator('a[aria-label="Visit X Profile"]');
        this.linkedInLink = page.locator('a[aria-label="Visit LinkedIn"]');
    }

    // Method to click on social media links
    openSocialMediaLink(name: string): Locator {
        switch (name) {
            case 'Instagram':
                return this.instagramLink;
            case 'XProfile':
                return this.xProfileLink;
            case 'LinkedIn':
                return this.linkedInLink;
            default:
                throw new Error(`Social media link not found for: ${name}`);
        }
    }
}

module.exports = { BasePage };