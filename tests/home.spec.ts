import { test, expect } from '@playwright/test';

test.describe('Home Page - Book Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Loading', () => {
    test('should display loading state initially', async ({ page }) => {
      await page.goto('/', { waitUntil: 'commit' });
      const loadingText = page.getByText('Loading books...');
      await expect(loadingText).toBeVisible();
    });

    test('should display page title and subtitle after loading', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
      await expect(page.getByText('Discover amazing books from various genres')).toBeVisible();
    });

    test('should display "Add New Book" button', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Add New Book' })).toBeVisible();
    });
  });

  test.describe('Book List Display', () => {
    test('should display a list of books', async ({ page }) => {
      await expect(page.getByText('The Great Gatsby')).toBeVisible();
      await expect(page.getByText('To Kill a Mockingbird')).toBeVisible();
      await expect(page.getByText('1984')).toBeVisible();
    });

    test('should display book author information', async ({ page }) => {
      await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
      await expect(page.getByText('by Harper Lee')).toBeVisible();
      await expect(page.getByText('by George Orwell')).toBeVisible();
    });

    test('should display book genre badges', async ({ page }) => {
      await expect(page.getByText('Classic').first()).toBeVisible();
      await expect(page.getByText('Dystopian')).toBeVisible();
      await expect(page.getByText('Fantasy')).toBeVisible();
    });

    test('should display book ratings with star emoji', async ({ page }) => {
      const bookCards = page.locator('a[href^="/book/"]');
      await expect(bookCards.first()).toContainText('⭐');
    });

    test('should display book page count', async ({ page }) => {
      await expect(page.getByText('180 pages').first()).toBeVisible();
    });

    test('should display "View details" link text for each book', async ({ page }) => {
      const viewDetailsLinks = page.getByText('View details →');
      await expect(viewDetailsLinks.first()).toBeVisible();
    });

    test('should display correct number of initial books', async ({ page }) => {
      const bookCards = page.locator('a[href^="/book/"]');
      await expect(bookCards).toHaveCount(5);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to book detail page when clicking a book card', async ({ page }) => {
      await page.getByText('The Great Gatsby').click();
      await expect(page).toHaveURL(/\/book\/1/);
    });

    test('should navigate to add book page when clicking "Add New Book"', async ({ page }) => {
      await page.getByRole('link', { name: 'Add New Book' }).click();
      await expect(page).toHaveURL('/add-book');
    });

    test('should be able to click different book cards', async ({ page }) => {
      await page.getByText('1984').click();
      await expect(page).toHaveURL(/\/book\/3/);
    });
  });

  test.describe('Book Card Content', () => {
    test('should display book description preview', async ({ page }) => {
      const gatsbyCard = page.locator('a[href="/book/1"]');
      await expect(gatsbyCard).toContainText('A story of decadence and excess');
    });

    test('should display published year for books', async ({ page }) => {
      await expect(page.getByText('1925').first()).toBeVisible();
      await expect(page.getByText('1960').first()).toBeVisible();
    });
  });

  test.describe('Layout and Styling', () => {
    test('should have proper page structure', async ({ page }) => {
      await expect(page.locator('.max-w-7xl')).toBeVisible();
      await expect(page.locator('.min-h-screen')).toBeVisible();
    });

    test('should use grid layout for book cards', async ({ page }) => {
      const gridContainer = page.locator('.grid');
      await expect(gridContainer).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible heading structure', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText('Book Library');
    });

    test('should have accessible links', async ({ page }) => {
      const addBookLink = page.getByRole('link', { name: 'Add New Book' });
      await expect(addBookLink).toBeVisible();
      await expect(addBookLink).toHaveAttribute('href', '/add-book');
    });

    test('book cards should be keyboard navigable', async ({ page }) => {
      await page.keyboard.press('Tab');
      const firstFocusedElement = page.locator(':focus');
      await expect(firstFocusedElement).toBeVisible();
    });
  });
});
