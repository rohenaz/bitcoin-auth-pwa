import { test, expect } from '@playwright/test';

test.describe('Bitcoin Auth Flow', () => {
  test('should display landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for main elements
    await expect(page).toHaveTitle(/Bitcoin Auth/);
    await expect(page.getByRole('heading', { name: 'Bitcoin Auth PWA', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
  });

  test('should navigate to signup flow', async ({ page }) => {
    await page.goto('/');
    
    // Click get started
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Should redirect to signup
    await expect(page).toHaveURL('/signup');
    
    // Should show the signup page heading
    await expect(page.getByRole('heading', { name: 'Welcome to Bitcoin Auth', level: 1 })).toBeVisible();
  });

  test('should create new identity', async ({ page }) => {
    await page.goto('/signup');
    
    // Wait for page to load and click generate button
    await page.getByRole('button', { name: 'Generate New Bitcoin Identity' }).click();
    
    // Should show password creation
    await expect(page.getByText('Create Password')).toBeVisible({ timeout: 10000 });
    
    // Enter password
    await page.getByRole('textbox', { name: 'Create Password' }).fill('TestPassword123!');
    
    // Click continue to go to backup page
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Should show backup download page with "Secure Your Identity" heading
    await expect(page.getByRole('heading', { name: 'Secure Your Identity', level: 2 })).toBeVisible({ timeout: 10000 });
    
    // The backup page has a confirm password field
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('TestPassword123!');
    
    // Download button should be visible
    await expect(page.getByRole('button', { name: /Download Master Backup/ })).toBeVisible();
  });
});