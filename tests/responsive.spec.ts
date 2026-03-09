import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design - Viewport Breakpoints', () => {
  const viewports = [
    { name: 'Mobile S', width: 320, height: 568 },
    { name: 'Mobile M', width: 375, height: 667 },
    { name: 'Mobile L', width: 425, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Desktop', width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`should display correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Add New Book' })).toBeVisible();
    });
  }
});

test.describe('Responsive Design - Portrait and Landscape', () => {
  test('should work in portrait mode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
  });

  test('should work in landscape mode', async ({ page }) => {
    await page.setViewportSize({ width: 812, height: 375 });
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
  });
});

test.describe('Responsive Design - Mobile View', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('should display home page correctly on mobile viewport', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add New Book' })).toBeVisible();
  });

  test('should display books on mobile viewport', async ({ page }) => {
    await page.goto('/');
    
    const bookCards = page.locator('a[href^="/book/"]');
    await expect(bookCards.first()).toBeVisible();
  });

  test('should navigate to book detail on mobile viewport', async ({ page }) => {
    await page.goto('/');
    
    await page.getByText('The Great Gatsby').click();
    await expect(page).toHaveURL(/\/book\/1/);
  });

  test('should navigate to add book page on mobile viewport', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Add New Book' }).click();
    await expect(page).toHaveURL('/add-book');
  });

  test('should display book details correctly on mobile viewport', async ({ page }) => {
    await page.goto('/book/1');
    await page.waitForSelector('h1');
    
    await expect(page.getByRole('heading', { name: 'The Great Gatsby' })).toBeVisible();
    await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
  });

  test('should navigate back to library from book detail on mobile viewport', async ({ page }) => {
    await page.goto('/book/1');
    await page.waitForSelector('h1');
    
    await page.getByText('← Back to Library').first().click();
    await expect(page).toHaveURL('/');
  });

  test('should display add book form correctly on mobile viewport', async ({ page }) => {
    await page.goto('/add-book');
    
    await expect(page.getByRole('heading', { name: 'Add New Book' })).toBeVisible();
    await expect(page.getByLabel('Title *')).toBeVisible();
    await expect(page.getByLabel('Author *')).toBeVisible();
  });

  test('should allow form input on mobile viewport', async ({ page }) => {
    await page.goto('/add-book');
    
    await page.getByLabel('Title *').click();
    await page.getByLabel('Title *').fill('Mobile Test Book');
    await expect(page.getByLabel('Title *')).toHaveValue('Mobile Test Book');
  });

  test('should submit form successfully on mobile viewport', async ({ page }) => {
    await page.goto('/add-book');
    
    await page.getByLabel('Title *').fill('Mobile Submitted Book');
    await page.getByLabel('Author *').fill('Mobile Author');
    await page.getByRole('button', { name: 'Add Book' }).click();
    
    await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Responsive Design - Tablet View', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
  });

  test('should display home page correctly on tablet viewport', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
  });

  test('should show books in grid layout on tablet viewport', async ({ page }) => {
    await page.goto('/');
    
    const gridContainer = page.locator('.grid');
    await expect(gridContainer).toBeVisible();
  });

  test('should display book details on tablet viewport', async ({ page }) => {
    await page.goto('/book/1');
    await page.waitForSelector('h1');
    
    await expect(page.getByRole('heading', { name: 'The Great Gatsby' })).toBeVisible();
  });

  test('should display form fields on tablet viewport', async ({ page }) => {
    await page.goto('/add-book');
    
    await expect(page.getByLabel('Title *')).toBeVisible();
    await expect(page.getByLabel('Author *')).toBeVisible();
  });
});

test.describe('Responsive Design - Large Desktop View', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should display books in multi-column grid on large screens', async ({ page }) => {
    await page.goto('/');
    
    const gridContainer = page.locator('.grid');
    await expect(gridContainer).toBeVisible();
  });

  test('should have max-width container on large screens', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('.max-w-7xl')).toBeVisible();
  });
});

test.describe('Responsive Design - Complete Mobile User Journey', () => {
  test('should complete full user journey on small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
    
    await page.getByText('1984').click();
    await expect(page.getByRole('heading', { name: '1984' })).toBeVisible();
    
    await page.getByRole('link', { name: 'Add Another Book' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Book' })).toBeVisible();
    
    await page.getByLabel('Title *').fill('Mobile Journey Test');
    await page.getByLabel('Author *').fill('Mobile Journey Author');
    await page.getByRole('button', { name: 'Add Book' }).click();
    
    await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Responsive Design - Touch Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('should handle scrolling on home page', async ({ page }) => {
    await page.goto('/');
    
    await page.mouse.wheel(0, 200);
    
    await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
  });

  test('should handle form element interactions', async ({ page }) => {
    await page.goto('/add-book');
    
    const genreSelect = page.getByLabel('Genre');
    await genreSelect.click();
    await genreSelect.selectOption('Fantasy');
    
    await expect(genreSelect).toHaveValue('Fantasy');
  });
});

test.describe('Responsive Design - Grid Layout Verification', () => {
  test('should display single column grid on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const gridContainer = page.locator('.grid');
    await expect(gridContainer).toBeVisible();
  });

  test('should display two column grid on medium screens', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const gridContainer = page.locator('.grid');
    await expect(gridContainer).toBeVisible();
  });

  test('should display three column grid on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    
    const gridContainer = page.locator('.grid');
    await expect(gridContainer).toBeVisible();
  });
});
