// pages/AirbnbPage.ts
import { Locator, Page } from '@playwright/test';

export class AirbnbPage {
  readonly page: Page;
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
    this.page = page;
    this.emailLoginButton = page.locator('[data-testid="social-auth-button-email"]');
    this.emailInput = page.locator('[data-testid="email-login-email"]');
    this.continueButton = page.locator('.t1dqvypu');
    this.passwordInput = page.locator('[data-testid="email-signup-password"]');
    this.locationInput = page.locator('#bigsearch-query-location-input');
    this.suggestion = page.locator('#bigsearch-query-location-suggestion-0');
    this.checkInDate = page.locator('[aria-label="23, Wednesday, April 2025. Available. Select as check-in date."]');
    this.checkOutDate = page.locator('button[aria-label="27, Sunday, April 2025. Available. Select as checkout date."]');
    this.searchButton = page.locator('.c1nkokj4');
    this.priceElements = page.locator('._w3xh25');
    this.favoriteButtons = page.locator('.ckqgked');
    this.modal = page.locator('.b98pgng');
    this.wishlistCard = page.locator('[data-testid="save-to-list-modal-wishlist-card"] > [data-testid="card-container"] > .l1ovpqvx');
    this.roomNames = page.locator('.t1jojoys');
    this.roomDetails = page.locator('.t6mzqp7');
  }

  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.emailLoginButton.click();
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.passwordInput.fill(password);
    await this.continueButton.click();
  }

  async searchLocation(city: string) {
    await this.locationInput.fill(city);
    await this.suggestion.first().waitFor();
    const count = await this.suggestion.count();
    for (let i = 0; i < count; i++) {
      const text = await this.suggestion.nth(i).innerText(); //grab the text
      if (text.includes(city)) {
        await this.suggestion.nth(i).click({ force: true }); 
        break;
      }
    }
  }

  async setDatesAndSearch() {
    await this.checkInDate.click({ force: true });
    await this.checkOutDate.click({ force: true });
    await this.searchButton.click();
  }

  async selectCheapestRoom() {
    await this.priceElements.first().waitFor();
    const count = await this.priceElements.count();
  
    let minPrice = 5000;
    let minIndex = -1;
  
    for (let i = 0; i < count; i++) {
      const priceText = await this.priceElements.nth(i).innerText();
      const match = priceText.match(/\$?(\d+(?:\.\d+)?)/);
      const price = match ? parseFloat(match[1]) : NaN;    
      if (price < minPrice) {
        minPrice = price;
        minIndex = i;
      }
    }
  
    await this.favoriteButtons.nth(minIndex).click();
    await this.modal.waitFor({ state: 'visible' });
    await this.wishlistCard.click();
  
    const roomName = await this.roomNames.nth(minIndex).innerText();
    const roomDetail = await this.roomDetails.nth(minIndex).innerText();
  
    return { minPrice, minIndex, roomName, roomDetail }; 
  }
  
  
}
