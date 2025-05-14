# DemoWebShopTests-TS

## How to run test
### Run by file path
npx playwright test tests/specs/Checkout.spec.ts

### Run by test name
npx playwright test -g "Should complete checkout when valid payment provided"

### Run by tag
npx playwright test --grep @smoke

### Run with specific browser
npx playwright test --project=chromium tests/specs/Checkout.spec.ts

### Run in headed mode (non-headless)
npx playwright test tests/specs/Checkout.spec.ts --headed