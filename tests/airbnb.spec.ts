import { test, expect } from '@playwright/test';
import { AirbnbPage } from '../pages/AirbnbPage';
import { TestData } from '../data/TestData';

test('Airbnb Booking Flow Test', async ({ page }) => {
  const airbnb = new AirbnbPage(page);

  await airbnb.login(TestData.email, TestData.password);
  await airbnb.searchLocation(TestData.city);
  await airbnb.setDatesAndSearch();

  const { minPrice, minIndex, roomName, roomDetail } = await airbnb.selectCheapestRoom();

  // assertions
  expect(minIndex).toBeGreaterThanOrEqual(0);
  expect(minPrice).toBeLessThanOrEqual(TestData.maxExpectedPrice);
  expect(roomName).not.toBe('');
  expect(roomDetail).not.toBe('');

  console.log(`✅ cheapest room favorited: ${roomName} — ${roomDetail} — $${minPrice}`);
  await page.pause();
});
