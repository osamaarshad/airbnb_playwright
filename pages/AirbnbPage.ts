import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { TestData } from '../data/TestData';

export class AirbnbPage extends BasePage {
  readonly emailLoginButton: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly passwordInput: Locator;
  readonly locationInput: Locator;
  readonly suggestion: Locator;
  readonly checkInDate: Locator;
  readonly checkOutDate: Locator;
  readonly searchButton: Locator;
  readonly priceElements: Locator;
  readonly favoriteButtons: Locator;
  readonly modal: Locator;
  readonly wishlistCard: Locator;
  readonly roomNames: Locator;
  readonly roomDetails: Locator;

  constructor(page: Page) {
    super(page);
    this.emailLoginButton = page.locator('[data-testid="social-auth-button-email"]');
    this.emailInput = page.locator('[data-testid="email-login-email"]');
    this.continueButton = page.locator('.t1dqvypu');
    this.passwordInput = page.locator('[data-testid="email-signup-password"]');
    this.locationInput = page.locator('#bigsearch-query-location-input');
    this.suggestion = page.locator('#bigsearch-query-location-suggestion-0');
    this.checkInDate = page.locator(`[aria-label="${TestData.checkInDateLabel}"]`).first();
    this.checkOutDate = page.locator(`[aria-label="${TestData.checkOutDateLabel}"]`).first();
    this.searchButton = page.locator('.siey6h7');
    this.priceElements = page.locator('._w3xh25');
    this.favoriteButtons = page.locator('.ckqgked');
    this.modal = page.locator('.b98pgng');
    this.wishlistCard = page.locator('[data-testid="save-to-list-modal-wishlist-card"] > [data-testid="card-container"] > .l1ovpqvx');
    this.roomNames = page.locator('.t1jojoys');
    this.roomDetails = page.locator('.t6mzqp7');
  }

  async login(email: string, password: string) {
  try {
    await this.navigateTo('/login');

    // Wait for and click the "Continue with Email" button
    await this.waitForElement(this.emailLoginButton);
    await this.click(this.emailLoginButton);

    // Wait for email field, then fill
    await this.waitForElement(this.emailInput);
    await this.fill(this.emailInput, email);

    // Wait for and click "Continue"
    await this.waitForElement(this.continueButton);
    await this.click(this.continueButton);

    
    await this.waitForElement(this.passwordInput);  
    await this.fill(this.passwordInput, password);

    await this.waitForElement(this.continueButton);
    await this.click(this.continueButton);

    await this.waitForLoad();
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}


  async searchLocation(city: string) {
    try {
      await this.fill(this.locationInput, city);
      await this.waitForElement(this.suggestion.first());

      const count = await this.getCount(this.suggestion);
      for (let i = 0; i < count; i++) {
        const text = await this.getText(this.suggestion.nth(i));
        if (text.includes(city)) {
          await this.click(this.suggestion.nth(i), { force: true });
          break;
        }
      }
    } catch (error) {
      console.error(' Search location failed:', error);
      throw error;
    }
  }

  async setDatesAndSearch() {
    try {
      await this.click(this.checkInDate, { force: true });
      await this.waitForElement(this.checkOutDate);
      await this.click(this.checkOutDate, { force: true });
      await this.click(this.searchButton);
    } catch (error) {
      console.error(' Set dates and search failed:', error);
      throw error;
    }
  }

  async selectCheapestRoom() {
    try {
      await this.waitForElement(this.priceElements.first());

      const count = await this.getCount(this.priceElements);
      let minPrice = TestData.maxExpectedPrice;
      let minIndex = -1;

      for (let i = 0; i < count; i++) {
        const priceText = await this.getText(this.priceElements.nth(i));
        const match = priceText.match(/\$?(\d+(?:\.\d+)?)/);
        const price = match ? parseFloat(match[1]) : NaN;

        if (price < minPrice) {
          minPrice = price;
          minIndex = i;
        }
      }

      if (minIndex === -1) {
        throw new Error('No room found under expected max price.');
      }

      await this.click(this.favoriteButtons.nth(minIndex));
      await this.waitForElement(this.modal);
      await this.click(this.wishlistCard);

      const roomName = await this.getText(this.roomNames.nth(minIndex));
      const roomDetail = await this.getText(this.roomDetails.nth(minIndex));

      return { minPrice, minIndex, roomName, roomDetail };
    } catch (error) {
      console.error(' Selecting cheapest room failed:', error);
      throw error;
    }
  }
}
