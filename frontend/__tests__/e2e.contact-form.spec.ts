import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('validates and submits successfully', async ({ page }) => {
    await page.goto('/contact');

    // Make the form dirty with minimal changes
    await page.getByLabel('First Name').fill('Alice');
    await page.getByLabel('Email').fill('not-an-email');

    // Try to submit
    await page.getByRole('button', { name: 'Send message' }).click();

    // Expect validation for last name and email
    await expect(page.getByText('Last name is required.')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();

    // Fix inputs
    await page.getByLabel('Last Name').fill('Smith');
    await page.getByLabel('Email').fill('alice@example.com');

    // Submit again
    await page.getByRole('button', { name: 'Send message' }).click();

    // Success path navigates to thank-you
    await expect(page).toHaveURL(/\/contact\/thank-you$/);
    await expect(page.getByRole('heading', { name: 'Thanks for getting in touch' })).toBeVisible();
  });
});
