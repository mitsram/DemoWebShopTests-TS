import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Component object definitions
const ProductsGridSelectors = {
    container: '.product-grid',
    productItem: (productName: string) => 
        `.product-item:has(.product-title:text-is("${productName}"))`,
    addToCartButton: '.add-to-cart-button',
    productTitle: '.product-title'
};

export class ProductsGridComponent extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private getProductItemLocator(productName: string) {
        return this.page
            .locator('.product-grid')  // Container scope
            .locator('.product-item') // Product items
            .filter({
                // Exact match on product title element
                has: this.page.locator('.product-title')
                    .getByText(productName, { exact: true })
            });
    }

    public async addProductToCart(productName: string): Promise<void> {
        const productItem = this.getProductItemLocator(productName);

        await productItem.scrollIntoViewIfNeeded();
        
        const addButton = productItem.getByRole('button', { name: 'Add to cart', exact: true });
        await addButton.click();
        await this.waitForCartUpdate();
    }

    public async getProductPrice(productName: string): Promise<string> {
        const productItem = this.getProductItemLocator(productName);
        return await productItem.locator('.actual-price').innerText();
    }

    public async isProductVisible(productName: string): Promise<boolean> {
        const productItem = this.getProductItemLocator(productName);
        return await productItem.isVisible();
    }

    private async waitForCartUpdate(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('.bar-notification.success', {
            state: 'visible',
            timeout: 10000
        });
    }

    // Additional useful methods
    public async getAllProductTitles(): Promise<string[]> {
        return await this.page.locator(ProductsGridSelectors.productTitle)
            .allInnerTexts();
    }

    public async getProductCount(): Promise<number> {
        return await this.page.locator(ProductsGridSelectors.productTitle).count();
    }
}

// Usage example
/*
import { test } from '@playwright/test';
import { ProductsGridComponent } from './ProductsGridComponent';

test('Add product to cart', async ({ page }) => {
    const productsGrid = new ProductsGridComponent(page);
    
    await test.step('Verify product visibility', async () => {
        const isVisible = await productsGrid.isProductVisible('Smartphone');
        test.expect(isVisible).toBeTruthy();
    });

    await test.step('Add product to cart', async () => {
        await productsGrid.addProductToCart('Smartphone');
    });

    await test.step('Verify cart update', async () => {
        const count = await productsGrid.getProductCount();
        test.expect(count).toBeGreaterThan(0);
    });
});
*/