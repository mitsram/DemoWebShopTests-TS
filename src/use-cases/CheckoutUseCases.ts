import { Page } from '@playwright/test';
import { CheckoutPage } from '../page-objects/CheckoutPage';
import { Address, PaymentInformation, PaymentMethod, ShippingMethod } from '../entities';

export class CheckoutUseCases {
    private readonly checkoutPage: CheckoutPage;

    constructor(private readonly page: Page) {
        this.checkoutPage = new CheckoutPage(page);
    }

    public async completePurchase(paymentInformation: PaymentInformation): Promise<void> {
        await this.provideBillingAddress();
        await this.provideShippingAddress();
        await this.chooseShippingMethod(ShippingMethod.Standard);
        await this.providePaymentDetails(PaymentMethod.CreditCard, paymentInformation);
        await this.completeCheckout();
    }

    public async provideBillingAddress(data?: Address): Promise<void> {
        if (data) {
            await this.checkoutPage.fillAddressForm(data, true);
        }
        await this.checkoutPage.clickContinueOnBillingAddress();
    }

    public async provideShippingAddress(data?: Address): Promise<void> {
        if (data) {
            await this.checkoutPage.fillAddressForm(data, false);
        }
        await this.checkoutPage.clickContinueOnShippingAddress();
    }

    public async chooseShippingMethod(method: ShippingMethod): Promise<void> {
        const methodName = this.getShippingMethodName(method);
        const selector = `label:has-text("${methodName}") >> input[type="radio"]`;
        
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.locator(selector).click();
        await this.checkoutPage.clickContinueOnShippingMethod();
    }

    public async providePaymentDetails(method: PaymentMethod, data?: PaymentInformation): Promise<void> {
        await this.checkoutPage.selectPaymentMethod(method);
        await this.checkoutPage.clickContinueOnPaymentMethod();

        switch (method) {
            case PaymentMethod.CreditCard:
                if (!data) throw new Error('Payment information required for credit card');
                await this.checkoutPage.fillPaymentInformation(data);
                break;
                
            case PaymentMethod.PurchaseOrder:
                if (!data?.poNumber) throw new Error('PO number required');
                await this.page.locator('#purchaseordernumber').fill(data.poNumber);
                break;
                
            case PaymentMethod.CheckOrMoneyOrder:
            case PaymentMethod.CashOnDelivery:
                // No additional info needed
                break;
                
            default:
                throw new Error(`Unsupported payment method: ${method}`);
        }

        await this.checkoutPage.clickContinueOnPaymentInformation();
    }

    public async completeCheckout(): Promise<void> {
        await this.checkoutPage.confirmOrder();
    }

    public async verifyOrderConfirmation(): Promise<boolean> {
        return await this.checkoutPage.isOrderSuccessfullyProcessed();
    }

    private getShippingMethodName(method: ShippingMethod): string {
        const methodMap = {
            [ShippingMethod.Standard]: 'Ground',
            [ShippingMethod.NextDayAir]: 'Next Day Air',
            [ShippingMethod.SecondDayAir]: '2nd Day Air'
        };
        
        if (!(method in methodMap)) {
            throw new Error(`Unsupported shipping method: ${method}`);
        }
        
        return methodMap[method];
    }
}

// Recommended types.ts content:
/*
export enum ShippingMethod {
    Standard = 'Standard',
    NextDayAir = 'NextDayAir',
    SecondDayAir = 'SecondDayAir'
}

export interface PaymentInformation {
    creditCardType?: string;
    cardholderName?: string;
    cardNumber?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvv?: string;
    poNumber?: string;
}

export interface Address {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    city: string;
    address1: string;
    address2?: string;
    zipPostalCode: string;
    phoneNumber: string;
}
*/