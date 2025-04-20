import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

const SearchComponents = {
    searchBox: '#small-searchterms',
    searchButton: '.search-box-button'
};

export class MainPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async searchProduct(productName: string): Promise<void> {
        await this.page.locator(SearchComponents.searchBox).fill(productName);
        await this.page.locator(SearchComponents.searchButton).click();
    }

    public async clickOnShoppingCart(): Promise<void> {
        await this.page.locator('#topcartlink').click();
    }

    // Optional: Add wait for shopping cart page load if needed
    public async navigateToShoppingCart(): Promise<void> {
        await this.clickOnShoppingCart();
        await this.page.waitForURL(/\/cart/); // Example of adding navigation wait
    }
}