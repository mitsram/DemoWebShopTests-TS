import { Page } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async navigateToHomePage(url: string): Promise<void> {
        await this.page.goto(url);
    }

    public async clickOnLoginLink(): Promise<void> {
        await this.page.locator('.ico-login').click();
    }

    public isOnLoginPage(): boolean {
        return this.page.url().endsWith('/login');
    }

    public async isLoggedIn(username: string): Promise<boolean> {
        try {
            const userElement = this.page.getByText(username, { exact: true });
            return await userElement.isVisible({ timeout: 5000 });
        } catch (e) {
            return false;
        }
    }
}