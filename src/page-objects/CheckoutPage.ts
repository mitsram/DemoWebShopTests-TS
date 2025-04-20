import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import Address from '../entities/Address';
import PaymentInformation from '../entities/PaymentInformation';
import { PaymentMethod } from '../entities/PaymentMethod';


// Component Selectors
const CheckoutComponents = {
    Billing: {
        container: '#billing-buttons-container',
        continueButton: '.new-address-next-step-button',
        fields: {
            firstName: '#BillingNewAddress_FirstName',
            lastName: '#BillingNewAddress_LastName',
            email: '#BillingNewAddress_Email',
            country: '#BillingNewAddress_CountryId',
            city: '#BillingNewAddress_City',
            address1: '#BillingNewAddress_Address1',
            address2: '#BillingNewAddress_Address2',
            zip: '#BillingNewAddress_ZipPostalCode',
            phone: '#BillingNewAddress_PhoneNumber'
        }
    },
    Shipping: {
        container: '#shipping-buttons-container',
        fields: {
            firstName: '#ShippingNewAddress_FirstName',
            lastName: '#ShippingNewAddress_LastName',
            // ... other shipping fields similar to billing
        }
    },
    Payment: {
        method: (method: string) => `label:has-text("${method}") >> input[type="radio"]`,
        info: {
            type: '#CreditCardType',
            cardholderName: '#CardholderName',
            cardNumber: '#CardNumber',
            expireMonth: '#ExpireMonth',
            expireYear: '#ExpireYear',
            cvv: '#CardCode'
        }
    },
    OrderConfirmation: {
        successMessage: 'text=Your order has been successfully processed!',
        confirmButton: '#confirm-order-buttons-container .confirm-order-next-step-button'
    }
};

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private async waitForComponent(selector: string): Promise<void> {
        await this.page.waitForSelector(selector, { state: 'visible' });
    }

    // Continue Click Methods
    public async clickContinueOnBillingAddress(): Promise<void> {
        await this.waitForComponent(CheckoutComponents.Billing.container);
        const container = this.page.locator(CheckoutComponents.Billing.container);
        await container.locator(CheckoutComponents.Billing.continueButton).click();
        await this.page.waitForLoadState('networkidle');
    }

    public async clickContinueOnShippingAddress(): Promise<void> {
        await this.clickContinueButton('#shipping-buttons-container', '.new-address-next-step-button');
    }

    public async clickContinueOnShippingMethod(): Promise<void> {
        await this.clickContinueButton('#shipping-method-buttons-container', '.shipping-method-next-step-button');
    }

    public async clickContinueOnPaymentMethod(): Promise<void> {
        await this.clickContinueButton('#payment-method-buttons-container', '.payment-method-next-step-button');
    }

    public async clickContinueOnPaymentInformation(): Promise<void> {
        await this.clickContinueButton('#payment-info-buttons-container', '.payment-info-next-step-button');
    }

    private async clickContinueButton(containerSelector: string, buttonSelector: string): Promise<void> {
        await this.waitForComponent(containerSelector);
        const container = this.page.locator(containerSelector);
        await container.locator(buttonSelector).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Payment Methods
    public async selectPaymentMethod(method: PaymentMethod): Promise<void> {
        await this.page.locator(CheckoutComponents.Payment.method(method)).click();
    }

    // Address Handling
    public async fillAddressForm(address: Address, isBilling: boolean = true): Promise<void> {
        const prefix = isBilling ? 'Billing' : 'Shipping';
        const fields = {
            firstName: `#${prefix}NewAddress_FirstName`,
            lastName: `#${prefix}NewAddress_LastName`,
            email: `#${prefix}NewAddress_Email`,
            country: `#${prefix}NewAddress_CountryId`,
            city: `#${prefix}NewAddress_City`,
            address1: `#${prefix}NewAddress_Address1`,
            address2: `#${prefix}NewAddress_Address2`,
            zip: `#${prefix}NewAddress_ZipPostalCode`,
            phone: `#${prefix}NewAddress_PhoneNumber`
        };

        await this.page.locator(fields.firstName).fill(address.firstName);
        await this.page.locator(fields.lastName).fill(address.lastName);
        await this.page.locator(fields.email).fill(address.email);
        await this.page.locator(fields.country).selectOption({ label: address.country });
        await this.page.locator(fields.city).fill(address.city);
        await this.page.locator(fields.address1).fill(address.address1);
        await this.page.locator(fields.address2).fill(address.address2);
        await this.page.locator(fields.zip).fill(address.zipPostalCode);
        await this.page.locator(fields.phone).fill(address.phoneNumber);
    }

    // Payment Information
    public async fillPaymentInformation(data: PaymentInformation): Promise<void> {
        await this.page.locator(CheckoutComponents.Payment.info.type).selectOption(data.creditCardType);
        await this.page.locator(CheckoutComponents.Payment.info.cardholderName).fill(data.cardholderName);
        await this.page.locator(CheckoutComponents.Payment.info.cardNumber).fill(data.cardNumber);
        await this.page.locator(CheckoutComponents.Payment.info.expireMonth).selectOption(data.expirationMonth);
        await this.page.locator(CheckoutComponents.Payment.info.expireYear).selectOption(data.expirationYear);
        await this.page.locator(CheckoutComponents.Payment.info.cvv).fill(data.cvv);
    }

    // Order Confirmation
    public async confirmOrder(): Promise<void> {
        await this.page.locator(CheckoutComponents.OrderConfirmation.confirmButton).click();
        await this.page.waitForLoadState('networkidle');
    }

    public async isOrderSuccessfullyProcessed(): Promise<boolean> {
        await this.page.waitForSelector(CheckoutComponents.OrderConfirmation.successMessage, {
            state: 'visible',
            timeout: 15000
        });
        return this.page.locator(CheckoutComponents.OrderConfirmation.successMessage).isVisible();
    }
}

// Usage Example
/*
import { test } from '@playwright/test';
import { CheckoutPage, Address, PaymentMethod, PaymentInformation } from './CheckoutPage';

test('Complete checkout process', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    const testAddress: Address = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        country: 'United States',
        city: 'New York',
        address1: '123 Main St',
        address2: 'Apt 4B',
        zipPostalCode: '10001',
        phoneNumber: '555-123-4567'
    };

    const paymentInfo: PaymentInformation = {
        creditCardType: 'Visa',
        cardholderName: 'John Doe',
        cardNumber: '4111111111111111',
        expirationMonth: '12',
        expirationYear: '2026',
        cvv: '123'
    };

    await test.step('Fill billing address', async () => {
        await checkoutPage.fillAddressForm(testAddress);
        await checkoutPage.clickContinueOnBillingAddress();
    });

    await test.step('Select payment method', async () => {
        await checkoutPage.selectPaymentMethod(PaymentMethod.CreditCard);
        await checkoutPage.clickContinueOnPaymentMethod();
    });

    await test.step('Enter payment information', async () => {
        await checkoutPage.fillPaymentInformation(paymentInfo);
        await checkoutPage.clickContinueOnPaymentInformation();
    });

    await test.step('Confirm order', async () => {
        await checkoutPage.confirmOrder();
        test.expect(await checkoutPage.isOrderSuccessfullyProcessed()).toBeTruthy();
    });
});
*/