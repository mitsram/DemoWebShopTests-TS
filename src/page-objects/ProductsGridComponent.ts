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

    public async addProductToCart(productName: string): Promise<void> {
        const productItem = this.page.locator(
            ProductsGridSelectors.productItem(productName)
        );

        // Scroll to the product item for better visibility
        await productItem.scrollIntoViewIfNeeded();

        // Click the add to cart button within the product item
        const addButton = productItem.locator(ProductsGridSelectors.addToCartButton);
        await addButton.click();

        // Wait for cart update confirmation
        await this.waitForCartUpdate();
    }

    public async getProductPrice(productName: string): Promise<string> {
        const productItem = this.page.locator(
            ProductsGridSelectors.productItem(productName)
        );
        return await productItem.locator('.actual-price').innerText();
    }

    public async isProductVisible(productName: string): Promise<boolean> {
        const productItem = this.page.locator(
            ProductsGridSelectors.productItem(productName)
        );
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