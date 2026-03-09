import { test, expect } from '@playwright/test';

test.describe('Book Detail Page', () => {
  test.describe('Loading State', () => {
    test('should display loading state when navigating to book detail', async ({ page }) => {
      await page.goto('/book/1', { waitUntil: 'commit' });
      const loadingText = page.getByText('Loading book details...');
      await expect(loadingText).toBeVisible();
    });
  });

  test.describe('Book Information Display', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/book/1');
      await page.waitForSelector('h1');
    });

    test('should display book title', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'The Great Gatsby' })).toBeVisible();
    });

    test('should display book author', async ({ page }) => {
      await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
    });

    test('should display book rating with star', async ({ page }) => {
      await expect(page.getByText('4.2')).toBeVisible();
      await expect(page.getByText('⭐')).toBeVisible();
    });

    test('should display genre information', async ({ page }) => {
      await expect(page.getByText('Genre', { exact: false })).toBeVisible();
      await expect(page.getByText('Classic')).toBeVisible();
    });

    test('should display published year', async ({ page }) => {
      await expect(page.getByText('Published Year', { exact: false })).toBeVisible();
      await expect(page.getByText('1925')).toBeVisible();
    });

    test('should display page count', async ({ page }) => {
      await expect(page.getByText('180 pages')).toBeVisible();
    });

    test('should display ISBN', async ({ page }) => {
      await expect(page.getByText('ISBN', { exact: false })).toBeVisible();
      await expect(page.getByText('978-0743273565')).toBeVisible();
    });

    test('should display book description', async ({ page }) => {
      await expect(page.getByText('Description')).toBeVisible();
      await expect(page.getByText('A story of decadence and excess')).toBeVisible();
    });

    test('should display star rating visualization', async ({ page }) => {
      const ratingStars = page.locator('text=★');
      await expect(ratingStars.first()).toBeVisible();
    });
  });

  test.describe('Navigation Links', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/book/1');
      await page.waitForSelector('h1');
    });

    test('should display "Back to Library" link at top', async ({ page }) => {
      const backLink = page.getByText('← Back to Library').first();
      await expect(backLink).toBeVisible();
    });

    test('should navigate back to home when clicking "Back to Library" at top', async ({ page }) => {
      await page.getByText('← Back to Library').first().click();
      await expect(page).toHaveURL('/');
    });

    test('should display "Back to Library" button at bottom', async ({ page }) => {
      const backButton = page.getByRole('link', { name: 'Back to Library' }).last();
      await expect(backButton).toBeVisible();
    });

    test('should display "Add Another Book" button', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Add Another Book' })).toBeVisible();
    });

    test('should navigate to add book page when clicking "Add Another Book"', async ({ page }) => {
      await page.getByRole('link', { name: 'Add Another Book' }).click();
      await expect(page).toHaveURL('/add-book');
    });
  });

  test.describe('Different Books', () => {
    test('should display correct details for book ID 2', async ({ page }) => {
      await page.goto('/book/2');
      await page.waitForSelector('h1');
      
      await expect(page.getByRole('heading', { name: 'To Kill a Mockingbird' })).toBeVisible();
      await expect(page.getByText('by Harper Lee')).toBeVisible();
      await expect(page.getByText('1960')).toBeVisible();
    });

    test('should display correct details for book ID 3', async ({ page }) => {
      await page.goto('/book/3');
      await page.waitForSelector('h1');
      
      await expect(page.getByRole('heading', { name: '1984' })).toBeVisible();
      await expect(page.getByText('by George Orwell')).toBeVisible();
      await expect(page.getByText('Dystopian')).toBeVisible();
    });

    test('should display correct details for book ID 5', async ({ page }) => {
      await page.goto('/book/5');
      await page.waitForSelector('h1');
      
      await expect(page.getByRole('heading', { name: 'The Hobbit' })).toBeVisible();
      await expect(page.getByText('by J.R.R. Tolkien')).toBeVisible();
      await expect(page.getByText('Fantasy')).toBeVisible();
    });
  });

  test.describe('Complete User Flow', () => {
    test('should complete navigation from home to book detail and back', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
      
      await page.getByText('Pride and Prejudice').click();
      await page.waitForSelector('h1:has-text("Pride and Prejudice")');
      
      await expect(page.getByText('by Jane Austen')).toBeVisible();
      await expect(page.getByText('Romance')).toBeVisible();
      
      await page.getByText('← Back to Library').first().click();
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
    });
  });

  test.describe('Layout and Styling', () => {
    test('should have proper page structure', async ({ page }) => {
      await page.goto('/book/1');
      await page.waitForSelector('h1');
      
      await expect(page.locator('.max-w-4xl')).toBeVisible();
      await expect(page.locator('.bg-white.rounded-lg')).toBeVisible();
    });

    test('should display book info in grid layout', async ({ page }) => {
      await page.goto('/book/1');
      await page.waitForSelector('h1');
      
      const infoGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2').first();
      await expect(infoGrid).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/book/1');
      await page.waitForSelector('h1');
      
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toHaveText('The Great Gatsby');
    });

    test('should have accessible back navigation links', async ({ page }) => {
      await page.goto('/book/1');
      await page.waitForSelector('h1');
      
      const backLinks = page.getByRole('link', { name: /Back to Library/ });
      await expect(backLinks.first()).toBeVisible();
    });
  });
});
