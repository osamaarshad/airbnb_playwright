// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests', // Directory where your test files are located
  timeout:30*1000,
  expect:{
    timeout:5000
  },
  reporter: 'html',

  
  use: {
    baseURL: 'https://www.airbnb.com',
    headless: false,          // Run tests in headless mode (without a browser UI)
    browserName: 'chromium', // Use Chromium browser for tests
            // Generate HTML report after tests run
  },
 
});









































