import { test, expect } from '@playwright/test';
import { 
    AuthenticationUseCases,
    ShopUseCases,
    CartUseCases,
    CheckoutUseCases
} from '../../src/use-cases/Index';
import { User, PaymentInformation } from '../../src/entities';
import { paymentInformationBuilder } from '../data/builders/PaymentInformationBuilder';

interface Product {
    name: string;
}


test.describe('Checkout Tests', { tag: '@smoke' }, () => {
    let authentication: AuthenticationUseCases;
    let shop: ShopUseCases;
    let cart: CartUseCases;
    let checkout: CheckoutUseCases;
    
    test.beforeEach(async ({ page }) => {
        authentication = new AuthenticationUseCases(page);
        shop = new ShopUseCases(page);
        cart = new CartUseCases(page);
        checkout = new CheckoutUseCases(page);

        const user: User = {
            username: process.env.USERNAME!,
            password: process.env.PASSWORD!
        };

        await authentication.navigateToLoginWidget();
        await authentication.attemptLogin(user);
    });

    test('Should complete checkout when valid payment provided', async () => {
        // Arrange
        const product: Product = { name: 'Blue Jeans' };
        const paymentInformation: PaymentInformation = paymentInformationBuilder();

        // Act
        await test.step('Search and add product to cart', async () => {
            await shop.searchProduct(product.name);
            await shop.addProductToCart(product.name);
        });

        await test.step('Navigate through checkout process', async () => {
            await shop.goToCart();
            await cart.proceedToCheckout();
            await checkout.completePurchase(paymentInformation);
        });

        // Assert
        const result = await checkout.verifyOrderConfirmation();
        expect(result, 'Order confirmation should be visible').toBe(true);
    });
});