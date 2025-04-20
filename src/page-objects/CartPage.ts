import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

const CartPageComponents = {
    TermsOfService: '#termsofservice',
    CheckoutButton: '#checkout',
    CartItems: '.cart-item-row',
    QuantityInput: 'input.qty-input',
    UpdateCartButton: 'input[name="updatecart"]',
    ContinueShoppingButton: 'input[name="continueshopping"]'
};

export class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async clickOnTermsOfService(): Promise<void> {
        await this.page.locator(CartPageComponents.TermsOfService).click();
    }

    public async clickOnCheckoutButton(): Promise<void> {
        await this.page.locator(CartPageComponents.CheckoutButton).click();
        await this.page.waitForLoadState('networkidle');
    }

    // Additional enhanced methods
    public async getCartItemCount(): Promise<number> {
        return await this.page.locator(CartPageComponents.CartItems).count();
    }

    public async updateProductQuantity(productIndex: number, newQuantity: number): Promise<void> {
        const quantityInputs = await this.page.locator(CartPageComponents.QuantityInput).all();
        await quantityInputs[productIndex].fill(newQuantity.toString());
        await this.page.locator(CartPageComponents.UpdateCartButton).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    public async continueShopping(): Promise<void> {
        await this.page.locator(CartPageComponents.ContinueShoppingButton).click();
        await this.page.waitForURL(/\/category/); // Adjust URL pattern as needed
    }

    // Verification methods
    public async isCheckoutEnabled(): Promise<boolean> {
        return await this.page.locator(CartPageComponents.CheckoutButton).isEnabled();
    }

    public async areTermsOfServiceAccepted(): Promise<boolean> {
        return await this.page.locator(CartPageComponents.TermsOfService).isChecked();
    }
}

// Usage example
/*
import { test } from '@playwright/test';
import { CartPage } from './CartPage';

test.describe('Cart Page Tests', () => {
    test('Complete checkout process', async ({ page }) => {
        const cartPage = new CartPage(page);
        
        await test.step('Accept terms of service', async () => {
            await cartPage.clickOnTermsOfService();
            test.expect(await cartPage.areTermsOfServiceAccepted()).toBeTruthy();
        });

        await test.step('Initiate checkout', async () => {
            await cartPage.clickOnCheckoutButton();
            await page.waitForURL(/\/checkout/);
        });
    });
});
*/