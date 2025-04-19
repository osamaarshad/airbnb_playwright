// tests/airbnb.spec.ts
import { test, expect } from '@playwright/test';
import { AirbnbPage } from '../pages/AirbnbPage';

test('Airbnb Booking Flow Test', async ({ page }) => {
  const airbnb = new AirbnbPage(page);

  await airbnb.login('farhan1232025@gmail.com', '!A12345678');
  await airbnb.searchLocation('Lahore');
  await airbnb.setDatesAndSearch();

  const { minPrice, minIndex, roomName, roomDetail } = await airbnb.selectCheapestRoom();

  // assert
  expect(minIndex).toBeGreaterThanOrEqual(0);
  expect(minPrice).toBeLessThanOrEqual(5000); 
  expect(roomName).not.toBe('');
  expect(roomDetail).not.toBe('');

  console.log(`✅ Cheapest room favorited: ${roomName} — ${roomDetail} — $${minPrice}`);

  await page.pause(); 
});
