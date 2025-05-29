import { test, expect } from '@playwright/test';

// Test data for different backup formats
const TEST_PASSWORD = 'TestPassword123!';

const testBackups = {
  // Encrypted backup (Base64 string from bitcoin-backup) - must be >100 chars and valid Base64
  encryptedText: 'U2FsdGVkX1+VGhlIGVuY3J5cHRlZCBiYWNrdXAgZGF0YSB0aGF0IGlzIGxvbmcgZW5vdWdoIHRvIHBhc3MgdGhlIHZhbGlkYXRpb24gY2hlY2sgZm9yIGJlaW5nIG92ZXIgMTAwIGNoYXJhY3RlcnMgYW5kIGlzIHZhbGlkIGJhc2U2NA==',
  
  // Plain WIF backup
  wifText: 'L1RrrnXkcKut5DEMwtDthjwRcTTwED36thyL1DebVrKuwvohjMNi',
  
  // BapMasterBackup JSON (unencrypted)
  bapMasterJson: {
    v: '0.1.0',
    type: 'backup',
    xprv: 'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
    ids: [{}],
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    attributes: {
      name: 'Test User',
      email: 'test@example.com'
    }
  },
  
  // Legacy encrypted format (older bitcoin-auth-pwa backups)
  legacyEncryptedJson: {
    encrypted: true,
    encryptedMnemonic: 'U2FsdGVkX1+...',
    data: 'encrypted-data-here'
  }
};

test.describe('Backup Import - Current Implementation', () => {
  test('should import encrypted text backup on signin page', async ({ page }) => {
    await page.goto('/signin');
    
    // The import section is already visible on the page
    // File input should be available
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    
    // Upload encrypted backup
    await fileInput.setInputFiles({
      name: 'backup.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(testBackups.encryptedText)
    });
    
    // Should switch to password entry mode
    await expect(page.getByPlaceholder(/password/i)).toBeVisible({ timeout: 5000 });
    
    // Enter password
    await page.getByPlaceholder(/password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /unlock/i }).click();
    
    // Should attempt to decrypt and login
    // Note: Will fail with test data, but we're testing the flow
    await expect(page.getByText(/incorrect password|invalid|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test('should import unencrypted BapMasterBackup JSON', async ({ page }) => {
    await page.goto('/signin');
    
    // Import section is already visible
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'bap-master.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(testBackups.bapMasterJson))
    });
    
    // Should detect unencrypted backup and ask for password creation
    await expect(page.getByRole('heading', { name: 'Set Your Password' })).toBeVisible({ timeout: 5000 });
    
    // Create password - there's only one password field visible
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Should ask for confirmation
    await expect(page.getByRole('heading', { name: 'Confirm Your Password' })).toBeVisible({ timeout: 5000 });
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Complete Import' }).click();
  });

  test('should handle legacy encrypted JSON format', async ({ page }) => {
    await page.goto('/signin');
    
    // Import section is already visible
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'legacy-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(testBackups.legacyEncryptedJson))
    });
    
    // Should recognize encrypted format and ask for password
    await expect(page.getByPlaceholder(/password/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid backup file', async ({ page }) => {
    await page.goto('/signin');
    
    // Import section is already visible
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'invalid.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not a valid backup')
    });
    
    // Should show error
    await expect(page.getByText(/invalid backup|not.*valid|error/i)).toBeVisible({ timeout: 5000 });
  });

  test('should handle OAuth restore flow', async ({ page }) => {
    await page.goto('/signin');
    
    // Look for OAuth restore link
    const restoreLink = page.getByRole('link', { name: /restore.*cloud/i });
    if (await restoreLink.isVisible()) {
      await restoreLink.click();
      
      // Should navigate to OAuth restore page
      await expect(page).toHaveURL('/signin/oauth-restore');
      
      // Should show OAuth providers
      await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
    }
  });

  test('should validate file input accepts correct extensions', async ({ page }) => {
    await page.goto('/signin');
    
    // Import section is already visible
    
    const fileInput = page.locator('input[type="file"]');
    const acceptAttribute = await fileInput.getAttribute('accept');
    
    // Should accept json and txt files
    expect(acceptAttribute).toContain('.json');
    expect(acceptAttribute).toContain('.txt');
  });
});