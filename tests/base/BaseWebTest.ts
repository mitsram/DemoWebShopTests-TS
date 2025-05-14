// tests/base.ts
import { test as base, expect, type Fixtures } from '@playwright/test';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// Configuration interface
interface TestConfig {
  browserType: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  baseUrl: string;
  slowMo?: number;
}

// Declare custom fixture types
type MyFixtures = {
  testConfig: TestConfig;
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

// Create the extended test
export const test = base.extend<{}, MyFixtures>({
  testConfig: [async ({}, use) => {
    const config: TestConfig = {
      browserType: (process.env.BROWSER_TYPE as 'chromium' | 'firefox' | 'webkit') || 'chromium',
      headless: false, // process.env.HEADLESS !== 'false',
      baseUrl: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : undefined,
    };
    await use(config);
  }, { scope: 'worker'}],

  browser: async ({ testConfig }, use) => {
    let browser: Browser;
    switch (testConfig.browserType) {
      case 'firefox':
        browser = await firefox.launch({
          headless: testConfig.headless,
          slowMo: testConfig.slowMo,
        });
        break;
      case 'webkit':
        browser = await webkit.launch({
          headless: testConfig.headless,
          slowMo: testConfig.slowMo,
        });
        break;
      default:
        browser = await chromium.launch({
          headless: testConfig.headless,
          slowMo: testConfig.slowMo,
        });
    }
    await use(browser);
    await browser.close();
  },

  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  page: async ({ context, testConfig }, use) => {
    const page = await context.newPage();
    await page.goto(testConfig.baseUrl);
    await use(page);
  },
});

export { expect };
