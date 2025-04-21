import { Page } from '@playwright/test';
import { CartPage } from '../page-objects/CartPage'; // Adjust path as needed

export class CartUseCases {
    private readonly cartPage: CartPage;

    constructor(private readonly page: Page) {
        this.cartPage = new CartPage(page);
    }

    public async proceedToCheckout(): Promise<void> {
        await this.cartPage.clickOnTermsOfService();
        await this.cartPage.clickOnCheckoutButton();
        
        // Optional: Add navigation wait if needed
        await this.page.waitForURL(/\/checkout/);
    }
}

// Usage in test file:
/*
import { test } from '@playwright/test';
import { CartUseCases } from './CartUseCases';

test('Proceed to checkout from cart', async ({ page }) => {
    const cartUseCases = new CartUseCases(page);
    
    await test.step('Navigate to cart page', async () => {
        await page.goto('/cart');
    });

    await test.step('Proceed to checkout', async () => {
        await cartUseCases.proceedToCheckout();
    });

    // Add verification steps
});
*/