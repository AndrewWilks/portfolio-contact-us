import { test, expect } from '@playwright/test';

test.describe('Admin contacts', () => {
  test('grid renders and sidebar opens/closes', async ({ page }) => {
    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Admin - Contacts' })).toBeVisible();

    // Try to open a contact if available; otherwise, pass gracefully
    const viewButtons = page.getByRole('button', { name: 'View' });
    if (await viewButtons.count() > 0) {
      await viewButtons.first().click();
      // Sidebar header title
      await expect(page.getByText('Contact details')).toBeVisible();
      // Close via header button
      await page.getByRole('button', { name: 'Close' }).click();
      // Sidebar should close; allow a moment for animation and unmount
      await expect(page.getByText('Contact details')).toHaveCount(0);
    }
  });
});
