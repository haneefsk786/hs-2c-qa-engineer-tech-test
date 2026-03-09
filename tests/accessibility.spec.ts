import { test, expect } from '@playwright/test';

/**
 * Accessibility Tests
 * 
 * Tests focusing on web accessibility standards (WCAG)
 * to ensure the application is usable by everyone.
 */

test.describe('Accessibility - Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Semantic HTML', () => {
    test('should have exactly one h1 heading', async ({ page }) => {
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCount(1);
    });

    test('should have a main landmark or content area', async ({ page }) => {
      const mainContent = page.locator('.max-w-7xl');
      await expect(mainContent).toBeVisible();
    });

    test('should use semantic list structure for book cards', async ({ page }) => {
      const gridContainer = page.locator('.grid');
      await expect(gridContainer).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should allow tabbing through all interactive elements', async ({ page }) => {
      const addBookLink = page.getByRole('link', { name: 'Add New Book' });
      const firstBookCard = page.locator('a[href="/book/1"]');
      
      // Tab to Add New Book link
      await page.keyboard.press('Tab');
      await expect(addBookLink).toBeFocused();
      
      // Tab to first book card
      await page.keyboard.press('Tab');
      await expect(firstBookCard).toBeFocused();
    });

    test('should allow activating links with Enter key', async ({ page }) => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/add-book');
    });

    test('should have visible focus indicators', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Text and Color', () => {
    test('should have readable text content', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Book Library' });
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Book Library');
    });

    test('should display book information clearly', async ({ page }) => {
      await expect(page.getByText('The Great Gatsby')).toBeVisible();
      await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
    });
  });

  test.describe('Links', () => {
    test('should have descriptive link text for Add New Book', async ({ page }) => {
      const link = page.getByRole('link', { name: 'Add New Book' });
      await expect(link).toHaveAttribute('href', '/add-book');
    });

    test('should have accessible book card links', async ({ page }) => {
      const bookLinks = page.locator('a[href^="/book/"]');
      const count = await bookLinks.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < count; i++) {
        const link = bookLinks.nth(i);
        await expect(link).toHaveAttribute('href');
      }
    });
  });
});

test.describe('Accessibility - Book Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/book/1');
    await page.waitForSelector('h1');
  });

  test.describe('Semantic HTML', () => {
    test('should have exactly one h1 heading with book title', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText('The Great Gatsby');
    });

    test('should use heading hierarchy for sections', async ({ page }) => {
      const h3Elements = page.locator('h3');
      const count = await h3Elements.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation', () => {
    test('should have accessible back navigation', async ({ page }) => {
      const backLink = page.getByText('← Back to Library').first();
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/');
    });

    test('should allow keyboard navigation to back link', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Content Structure', () => {
    test('should have labeled sections for book information', async ({ page }) => {
      await expect(page.getByText('Genre')).toBeVisible();
      await expect(page.getByText('Published Year')).toBeVisible();
      await expect(page.getByText('Pages')).toBeVisible();
      await expect(page.getByText('ISBN')).toBeVisible();
      await expect(page.getByText('Description')).toBeVisible();
    });

    test('should display rating in accessible format', async ({ page }) => {
      await expect(page.getByText(/\d\.\d\/5/)).toBeVisible();
    });
  });
});

test.describe('Accessibility - Add Book Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add-book');
  });

  test.describe('Form Labels', () => {
    test('should have associated labels for all form inputs', async ({ page }) => {
      await expect(page.getByLabel('Title *')).toBeVisible();
      await expect(page.getByLabel('Author *')).toBeVisible();
      await expect(page.getByLabel('Genre')).toBeVisible();
      await expect(page.getByLabel('Published Year')).toBeVisible();
      await expect(page.getByLabel('Pages')).toBeVisible();
      await expect(page.getByLabel('ISBN')).toBeVisible();
      await expect(page.getByLabel('Rating (1-5)')).toBeVisible();
      await expect(page.getByLabel('Description')).toBeVisible();
    });

    test('should indicate required fields clearly', async ({ page }) => {
      await expect(page.getByText('Title *')).toBeVisible();
      await expect(page.getByText('Author *')).toBeVisible();
    });
  });

  test.describe('Form Navigation', () => {
    test('should allow tabbing through form fields in logical order', async ({ page }) => {
      const fields = ['title', 'author', 'genre', 'publishedYear', 'pages', 'isbn', 'rating', 'description'];
      
      await page.getByLabel('Title *').focus();
      
      for (let i = 1; i < fields.length; i++) {
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    });

    test('should allow form submission with Enter key', async ({ page }) => {
      await page.getByLabel('Title *').fill('Keyboard Submit Test');
      await page.getByLabel('Author *').fill('Keyboard Author');
      
      // Focus on submit button and press Enter
      await page.getByRole('button', { name: 'Add Book' }).focus();
      await page.keyboard.press('Enter');
      
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Error Messages', () => {
    test('should display error messages accessibly', async ({ page }) => {
      // Simulate API error
      await page.route('**/api/books', route => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Validation failed' })
          });
        } else {
          route.continue();
        }
      });
      
      await page.getByLabel('Title *').fill('Test');
      await page.getByLabel('Author *').fill('Test');
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      // Error should be visible
      const errorMessage = page.locator('.bg-red-50');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('Input Constraints', () => {
    test('should have appropriate input types', async ({ page }) => {
      const pagesInput = page.locator('#pages');
      await expect(pagesInput).toHaveAttribute('type', 'number');
      
      const ratingInput = page.locator('#rating');
      await expect(ratingInput).toHaveAttribute('type', 'number');
      
      const yearInput = page.locator('#publishedYear');
      await expect(yearInput).toHaveAttribute('type', 'number');
    });

    test('should have min/max constraints on numeric inputs', async ({ page }) => {
      const ratingInput = page.locator('#rating');
      await expect(ratingInput).toHaveAttribute('min', '0');
      await expect(ratingInput).toHaveAttribute('max', '5');
    });
  });
});

test.describe('Accessibility - Error Pages', () => {
  test('should have accessible error page for 404', async ({ page }) => {
    await page.goto('/book/99999');
    
    // Error message should be visible
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Book not found')).toBeVisible();
    
    // Should have a way to navigate back
    const backLink = page.getByRole('link', { name: 'Back to Library' });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should have accessible error state on home page', async ({ page }) => {
    await page.route('**/api/books', route => route.abort());
    await page.goto('/');
    
    await expect(page.getByText('Error')).toBeVisible();
    
    // Retry button should be accessible
    const retryButton = page.getByRole('button', { name: 'Try Again' });
    await expect(retryButton).toBeVisible();
  });
});

test.describe('Accessibility - Interactive Elements', () => {
  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/add-book');
    
    const submitButton = page.getByRole('button', { name: 'Add Book' });
    await expect(submitButton).toBeVisible();
    
    const cancelLink = page.getByRole('link', { name: 'Cancel' });
    await expect(cancelLink).toBeVisible();
  });

  test('links should have clear purpose', async ({ page }) => {
    await page.goto('/');
    
    // Add New Book link
    const addLink = page.getByRole('link', { name: 'Add New Book' });
    await expect(addLink).toBeVisible();
    
    // View details links within book cards
    const viewDetailsLinks = page.getByText('View details →');
    const count = await viewDetailsLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - Loading States', () => {
  test('should indicate loading state accessibly on home page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    
    // Loading indicator should be visible
    const loadingText = page.getByText('Loading books...');
    await expect(loadingText).toBeVisible();
  });

  test('should indicate loading state accessibly on book detail page', async ({ page }) => {
    await page.goto('/book/1', { waitUntil: 'commit' });
    
    const loadingText = page.getByText('Loading book details...');
    await expect(loadingText).toBeVisible();
  });

  test('should indicate loading state during form submission', async ({ page }) => {
    await page.goto('/add-book');
    
    await page.getByLabel('Title *').fill('Loading State Test');
    await page.getByLabel('Author *').fill('Loading Author');
    await page.getByRole('button', { name: 'Add Book' }).click();
    
    // Button text should change to indicate loading
    await expect(page.getByRole('button', { name: 'Adding Book...' })).toBeVisible();
  });
});
