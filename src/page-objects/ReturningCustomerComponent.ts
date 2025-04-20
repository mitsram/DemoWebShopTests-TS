import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Component object definitions
const ReturningCustomerSelectors = {
    emailLabel: 'Email:',
    passwordLabel: 'Password:',
    loginButton: '.login-button',
    errorMessage: '.message-error'
};

export class ReturningCustomerComponent extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async loginAs(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    public async fillUsername(username: string): Promise<void> {
        await this.page.getByLabel(ReturningCustomerSelectors.emailLabel).fill(username);
    }

    public async fillPassword(password: string): Promise<void> {
        await this.page.getByLabel(ReturningCustomerSelectors.passwordLabel).fill(password);
    }

    public async clickLoginButton(): Promise<void> {
        await this.page.locator(ReturningCustomerSelectors.loginButton).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    // Verification methods
    public async isLoginErrorVisible(): Promise<boolean> {
        return await this.page.locator(ReturningCustomerSelectors.errorMessage).isVisible();
    }

    public async getLoginErrorMessage(): Promise<string> {
        return await this.page.locator(ReturningCustomerSelectors.errorMessage).innerText();
    }

    // Enhanced login with validation
    public async loginWithValidation(username: string, password: string): Promise<void> {
        await this.loginAs(username, password);
        
        if (await this.isLoginErrorVisible()) {
            const errorMessage = await this.getLoginErrorMessage();
            throw new Error(`Login failed: ${errorMessage}`);
        }
    }
}

// Usage example
/*
import { test } from '@playwright/test';
import { ReturningCustomerComponent } from './ReturningCustomerComponent';

test.describe('Login Tests', () => {
    test('Successful login', async ({ page }) => {
        const loginComponent = new ReturningCustomerComponent(page);
        
        await test.step('Perform login', async () => {
            await loginComponent.loginAs('user@example.com', 'password123');
        });

        await test.step('Verify successful login', async () => {
            test.expect(await loginComponent.isLoginErrorVisible()).toBeFalsy();
        });
    });

    test('Invalid login', async ({ page }) => {
        const loginComponent = new ReturningCustomerComponent(page);
        
        await test.step('Attempt invalid login', async () => {
            await loginComponent.loginAs('wrong@user.com', 'badpassword');
        });

        await test.step('Verify error message', async () => {
            test.expect(await loginComponent.isLoginErrorVisible()).toBeTruthy();
            const message = await loginComponent.getLoginErrorMessage();
            test.expect(message).toContain('Login was unsuccessful');
        });
    });
});
*/