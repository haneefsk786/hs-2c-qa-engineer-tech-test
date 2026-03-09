import { test, expect } from '@playwright/test';

test.describe('Error Scenarios and Edge Cases', () => {
  test.describe('404 - Book Not Found', () => {
    test('should display error message for non-existent book ID', async ({ page }) => {
      await page.goto('/book/9999');
      
      await expect(page.getByText('Error')).toBeVisible();
      await expect(page.getByText('Book not found')).toBeVisible();
    });

    test('should display back to library link on error page', async ({ page }) => {
      await page.goto('/book/9999');
      
      await expect(page.getByRole('link', { name: 'Back to Library' })).toBeVisible();
    });

    test('should navigate back to home from error page', async ({ page }) => {
      await page.goto('/book/9999');
      
      await page.getByRole('link', { name: 'Back to Library' }).click();
      await expect(page).toHaveURL('/');
    });

    test('should handle invalid book ID format gracefully', async ({ page }) => {
      await page.goto('/book/invalid-id');
      
      await expect(page.getByText('Error')).toBeVisible();
    });

    test('should handle negative book ID', async ({ page }) => {
      await page.goto('/book/-1');
      
      await expect(page.getByText('Error')).toBeVisible();
    });

    test('should handle zero as book ID', async ({ page }) => {
      await page.goto('/book/0');
      
      await expect(page.getByText('Error')).toBeVisible();
    });
  });

  test.describe('API Error Handling - Books List', () => {
    test('should handle network failure gracefully on home page', async ({ page }) => {
      await page.route('**/api/books', route => route.abort());
      
      await page.goto('/');
      
      await expect(page.getByText('Error')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
    });

    test('should allow retry on home page after error', async ({ page }) => {
      let requestCount = 0;
      await page.route('**/api/books', route => {
        requestCount++;
        if (requestCount === 1) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      await page.goto('/');
      await expect(page.getByText('Error')).toBeVisible();
      
      await page.getByRole('button', { name: 'Try Again' }).click();
      await expect(page.getByText('Book Library')).toBeVisible();
    });

    test('should handle 500 server error on home page', async ({ page }) => {
      await page.route('**/api/books', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await page.goto('/');
      
      await expect(page.getByText('Error')).toBeVisible();
    });
  });

  test.describe('API Error Handling - Book Detail', () => {
    test('should handle network failure on book detail page', async ({ page }) => {
      await page.route('**/api/books/1', route => route.abort());
      
      await page.goto('/book/1');
      
      await expect(page.getByText('Error')).toBeVisible();
    });

    test('should handle 500 error on book detail page', async ({ page }) => {
      await page.route('**/api/books/1', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await page.goto('/book/1');
      
      await expect(page.getByText('Error')).toBeVisible();
    });
  });

  test.describe('API Error Handling - Add Book', () => {
    test('should display error message when book creation fails', async ({ page }) => {
      await page.route('**/api/books', route => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Invalid book data' })
          });
        } else {
          route.continue();
        }
      });
      
      await page.goto('/add-book');
      await page.getByLabel('Title *').fill('Test Book');
      await page.getByLabel('Author *').fill('Test Author');
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.getByText('Invalid book data')).toBeVisible();
    });

    test('should display validation error from API', async ({ page }) => {
      await page.route('**/api/books', route => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Title and author are required' })
          });
        } else {
          route.continue();
        }
      });
      
      await page.goto('/add-book');
      await page.getByLabel('Title *').fill('Test');
      await page.getByLabel('Author *').fill('Test');
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.getByText('Title and author are required')).toBeVisible();
    });

    test('should handle network failure during book creation', async ({ page }) => {
      await page.route('**/api/books', route => {
        if (route.request().method() === 'POST') {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      await page.goto('/add-book');
      await page.getByLabel('Title *').fill('Test Book');
      await page.getByLabel('Author *').fill('Test Author');
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.locator('.bg-red-50')).toBeVisible();
    });

    test('should handle 500 server error during book creation', async ({ page }) => {
      await page.route('**/api/books', route => {
        if (route.request().method() === 'POST') {
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal server error' })
          });
        } else {
          route.continue();
        }
      });
      
      await page.goto('/add-book');
      await page.getByLabel('Title *').fill('Test Book');
      await page.getByLabel('Author *').fill('Test Author');
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.locator('.bg-red-50')).toBeVisible();
    });
  });

  test.describe('Edge Cases - URL Handling', () => {
    test('should handle trailing slash in URL', async ({ page }) => {
      await page.goto('/add-book/');
      await expect(page.getByRole('heading', { name: 'Add New Book' })).toBeVisible();
    });

    test('should handle book ID with leading zeros', async ({ page }) => {
      await page.goto('/book/001');
      await expect(page.getByRole('heading', { name: 'The Great Gatsby' })).toBeVisible();
    });
  });

  test.describe('Edge Cases - Empty State', () => {
    test('should display empty state message when no books exist', async ({ page }) => {
      await page.route('**/api/books', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });
      
      await page.goto('/');
      
      await expect(page.getByText('No books found')).toBeVisible();
      await expect(page.getByText('Start by adding your first book!')).toBeVisible();
    });

    test('should display book emoji in empty state', async ({ page }) => {
      await page.route('**/api/books', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });
      
      await page.goto('/');
      
      await expect(page.getByText('📚')).toBeVisible();
    });
  });

  test.describe('Slow Network Simulation', () => {
    test('should handle slow API response on home page', async ({ page }) => {
      await page.route('**/api/books', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.continue();
      });
      
      await page.goto('/');
      
      await expect(page.getByText('Loading books...')).toBeVisible();
      await expect(page.getByText('Book Library')).toBeVisible({ timeout: 10000 });
    });

    test('should handle slow API response on book detail page', async ({ page }) => {
      await page.route('**/api/books/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.continue();
      });
      
      await page.goto('/book/1');
      
      await expect(page.getByText('Loading book details...')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'The Great Gatsby' })).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Browser Navigation', () => {
    test('should handle browser back button correctly', async ({ page }) => {
      await page.goto('/');
      await page.getByText('The Great Gatsby').click();
      await page.waitForURL(/\/book\/1/);
      
      await page.goBack();
      
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
    });

    test('should handle browser forward button correctly', async ({ page }) => {
      await page.goto('/');
      await page.getByText('The Great Gatsby').click();
      await page.waitForURL(/\/book\/1/);
      await page.goBack();
      
      await page.goForward();
      
      await expect(page).toHaveURL('/book/1');
    });

    test('should handle page refresh on book detail', async ({ page }) => {
      await page.goto('/book/2');
      await page.waitForSelector('h1');
      
      await page.reload();
      
      await expect(page.getByRole('heading', { name: 'To Kill a Mockingbird' })).toBeVisible();
    });

    test('should handle page refresh on add book form', async ({ page }) => {
      await page.goto('/add-book');
      await page.getByLabel('Title *').fill('Test Title');
      
      await page.reload();
      
      await expect(page.getByLabel('Title *')).toHaveValue('');
    });
  });

  test.describe('Concurrent Operations', () => {
    test('should handle rapid navigation between pages', async ({ page }) => {
      await page.goto('/');
      
      await page.getByText('The Great Gatsby').click();
      await page.goto('/');
      await page.getByRole('link', { name: 'Add New Book' }).click();
      await page.goto('/book/2');
      
      await expect(page.getByRole('heading', { name: 'To Kill a Mockingbird' })).toBeVisible();
    });
  });
});
