import { Page } from '@playwright/test';
import { ReturningCustomerComponent } from '../page-objects/ReturningCustomerComponent';
import { BasePage } from '../page-objects/BasePage';
import User from '../entities/User';

export class AuthenticationUseCases {
    private readonly loginComponent: ReturningCustomerComponent;
    private readonly basePage: BasePage;

    constructor(private readonly page: Page) {
        this.loginComponent = new ReturningCustomerComponent(page);
        this.basePage = new BasePage(page);
    }

    public async navigateToLoginWidget(): Promise<void> {
        await this.basePage.clickOnLoginLink();
        const isOnLoginPage = await this.basePage.isOnLoginPage();
        
        // Using Playwright's assertion in test context would be better,
        // but maintaining original structure:
        if (!isOnLoginPage) {
            throw new Error('Not on login page after clicking login link');
        }
    }

    public async attemptLogin(user: User): Promise<boolean> {
        await this.loginComponent.loginAs(user.username, user.password);
        return await this.basePage.isLoggedIn(user.username);
    }
}

// Usage in test file
/*
import { test, expect } from '@playwright/test';
import { AuthenticationUseCases } from './AuthenticationUseCases';
import { User } from './types';

test.describe('Authentication Tests', () => {
    let authUseCases: AuthenticationUseCases;
    const testUser: User = {
        username: 'test@example.com',
        password: 'password123'
    };

    test.beforeEach(async ({ page }) => {
        authUseCases = new AuthenticationUseCases(page);
        await page.goto('https://demowebshop.telerik.com/');
    });

    test('Successful login flow', async () => {
        await test.step('Navigate to login widget', async () => {
            await authUseCases.navigateToLoginWidget();
        });

        await test.step('Attempt login with valid credentials', async () => {
            const loginSuccess = await authUseCases.attemptLogin(testUser);
            expect(loginSuccess).toBe(true);
        });
    });
});
*/