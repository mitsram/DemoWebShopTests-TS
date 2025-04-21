import { Page } from '@playwright/test';
import { MainPage } from '../page-objects/MainPage';
import { ProductsGridComponent } from '../page-objects/ProductsGridComponent';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';

export class ShopUseCases {
    private readonly mainPage: MainPage;
    private readonly productsGrid: ProductsGridComponent;
    private readonly cartPage: CartPage;
    private readonly checkoutPage: CheckoutPage;

    constructor(private readonly page: Page) {
        this.mainPage = new MainPage(page);
        this.productsGrid = new ProductsGridComponent(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    public async searchProduct(productName: string): Promise<void> {
        await this.mainPage.searchProduct(productName);
        await this.page.waitForLoadState('networkidle');
    }

    public async addProductToCart(productName: string): Promise<void> {
        await this.productsGrid.addProductToCart(productName);
        await this.page.waitForSelector('.bar-notification.success', { state: 'visible' });
    }

    public async goToCart(): Promise<void> {
        await this.mainPage.clickOnShoppingCart();
        await this.page.waitForURL(/\/cart/);
    }

    public async startCheckout(): Promise<void> {
        await this.goToCart();
        await this.cartPage.clickOnTermsOfService();
        await this.cartPage.clickOnCheckoutButton();
        await this.page.waitForURL(/\/checkout/);
    }
}

// Usage Example
/*
import { test } from '@playwright/test';
import { ShopUseCases } from './ShopUseCases';

test('Complete purchase flow', async ({ page }) => {
    const shopUseCases = new ShopUseCases(page);
    
    await test.step('Navigate to home page', async () => {
        await page.goto('https://demowebshop.telerik.com/');
    });

    await test.step('Search for product', async () => {
        await shopUseCases.searchProduct('Smartphone');
    });

    await test.step('Add product to cart', async () => {
        await shopUseCases.addProductToCart('Smartphone');
    });

    await test.step('Start checkout process', async () => {
        await shopUseCases.startCheckout();
    });
});
*/