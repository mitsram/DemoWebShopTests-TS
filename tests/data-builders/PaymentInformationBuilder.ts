import { PaymentInformation } from '../../src/entities';

export function paymentInformationBuilder(): PaymentInformation {
    return {
        creditCardType: 'Visa',
        cardholderName: 'Test User',
        cardNumber: '4111111111111111',
        expirationMonth: '12',
        expirationYear: '2026',
        cvv: '123',
        poNumber: 'PO123456'
    };
}