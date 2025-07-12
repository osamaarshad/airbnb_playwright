import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string) {
    try {
      await this.page.goto(path);
    } catch (error) {
      console.error(`Navigation to ${path} failed:`, error);
      throw error;
    }
  }

  async waitForLoad() {
    try {
      await this.page.waitForLoadState('load'); 
    } catch (error) {
      console.error('Page load wait failed:', error);
      throw error;
    }
  }

  async click(locator: Locator, options = {}) {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.click(options);
    } catch (error) {
      console.error('Click action failed:', error);
      throw error;
    }
  }

  async fill(locator: Locator, text: string) {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.fill(text);
    } catch (error) {
      console.error(`Filling input failed (text: "${text}"):`, error);
      throw error;
    }
  }

  async getText(locator: Locator): Promise<string> {
    try {
      await locator.waitFor({ state: 'visible' });
      return await locator.innerText();
    } catch (error) {
      console.error('Getting text failed:', error);
      throw error;
    }
  }

  async getCount(locator: Locator): Promise<number> {
    try {
      return await locator.count();
    } catch (error) {
      console.error('Getting count failed:', error);
      throw error;
    }
  }

  async waitForElement(locator: Locator) {
    try {
      await locator.waitFor({ state: 'visible' });
    } catch (error) {
      console.error('Waiting for element failed:', error);
      throw error;
    }
  }
}
