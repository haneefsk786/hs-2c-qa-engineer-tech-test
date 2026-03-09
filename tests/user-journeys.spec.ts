import { test, expect } from '@playwright/test';

/**
 * User Journey Tests
 * 
 * These tests simulate complete user workflows from start to finish,
 * testing the integration of all application components.
 */

test.describe('User Journeys - Complete Workflows', () => {
  
  test.describe('Journey 1: New User Browsing Books', () => {
    test('should allow a new user to browse and explore books', async ({ page }) => {
      // Step 1: User lands on home page
      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
      
      // Step 2: User sees the list of available books
      const bookCards = page.locator('a[href^="/book/"]');
      await expect(bookCards).toHaveCount(5);
      
      // Step 3: User clicks on a book that interests them
      await page.getByText('The Great Gatsby').click();
      
      // Step 4: User views book details
      await expect(page.getByRole('heading', { name: 'The Great Gatsby' })).toBeVisible();
      await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
      await expect(page.getByText('Classic')).toBeVisible();
      
      // Step 5: User decides to check another book
      await page.getByText('← Back to Library').first().click();
      await expect(page).toHaveURL('/');
      
      // Step 6: User browses another book
      await page.getByText('1984').click();
      await expect(page.getByRole('heading', { name: '1984' })).toBeVisible();
      await expect(page.getByText('by George Orwell')).toBeVisible();
    });
  });

  test.describe('Journey 2: User Adding a New Book', () => {
    test('should allow a user to add a new book to the library', async ({ page }) => {
      const uniqueTitle = `My Favorite Book ${Date.now()}`;
      
      // Step 1: User is on home page and wants to add a book
      await page.goto('/');
      await page.getByRole('link', { name: 'Add New Book' }).click();
      
      // Step 2: User is on the add book form
      await expect(page).toHaveURL('/add-book');
      await expect(page.getByRole('heading', { name: 'Add New Book' })).toBeVisible();
      
      // Step 3: User fills in book details
      await page.getByLabel('Title *').fill(uniqueTitle);
      await page.getByLabel('Author *').fill('John Smith');
      await page.getByLabel('Genre').selectOption('Fiction');
      await page.getByLabel('Published Year').fill('2024');
      await page.getByLabel('Pages').fill('350');
      await page.getByLabel('ISBN').fill('978-1234567890');
      await page.getByLabel('Rating (1-5)').fill('4.5');
      await page.getByLabel('Description').fill('An amazing story about adventure and discovery.');
      
      // Step 4: User submits the form
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      // Step 5: User sees success message
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
      
      // Step 6: User is redirected to the new book's detail page
      await page.waitForURL(/\/book\/\d+/);
      await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
      await expect(page.getByText('by John Smith')).toBeVisible();
      
      // Step 7: User goes back to library and sees the new book
      await page.getByText('← Back to Library').first().click();
      await expect(page.getByText(uniqueTitle)).toBeVisible();
    });
  });

  test.describe('Journey 3: User Encountering Errors', () => {
    test('should handle 404 error gracefully when book not found', async ({ page }) => {
      // Step 1: User tries to access a non-existent book
      await page.goto('/book/99999');
      
      // Step 2: User sees a friendly error message
      await expect(page.getByText('Error')).toBeVisible();
      await expect(page.getByText('Book not found')).toBeVisible();
      
      // Step 3: User can navigate back to the library
      await page.getByRole('link', { name: 'Back to Library' }).click();
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
    });

    test('should allow user to retry after API error on home page', async ({ page }) => {
      let requestCount = 0;
      
      // Simulate network failure on first request
      await page.route('**/api/books', route => {
        requestCount++;
        if (requestCount === 1) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      // Step 1: User visits home page and sees error
      await page.goto('/');
      await expect(page.getByText('Error')).toBeVisible();
      
      // Step 2: User clicks retry
      await page.getByRole('button', { name: 'Try Again' }).click();
      
      // Step 3: Page loads successfully
      await expect(page.getByRole('heading', { name: 'Book Library' })).toBeVisible();
    });
  });

  test.describe('Journey 4: User Canceling Book Addition', () => {
    test('should allow user to cancel book addition without saving', async ({ page }) => {
      // Step 1: User navigates to add book form
      await page.goto('/add-book');
      
      // Step 2: User starts filling the form
      await page.getByLabel('Title *').fill('Book I Changed My Mind About');
      await page.getByLabel('Author *').fill('Indecisive Author');
      
      // Step 3: User decides to cancel
      await page.getByRole('link', { name: 'Cancel' }).click();
      
      // Step 4: User is back on home page
      await expect(page).toHaveURL('/');
      
      // Step 5: Verify the book was not added
      await expect(page.getByText('Book I Changed My Mind About')).not.toBeVisible();
    });
  });

  test.describe('Journey 5: User Navigating Back and Forth', () => {
    test('should maintain proper navigation history', async ({ page }) => {
      // Step 1: Start on home page
      await page.goto('/');
      
      // Step 2: Navigate to book detail
      await page.getByText('Pride and Prejudice').click();
      await expect(page.getByRole('heading', { name: 'Pride and Prejudice' })).toBeVisible();
      
      // Step 3: Navigate to add book from detail page
      await page.getByRole('link', { name: 'Add Another Book' }).click();
      await expect(page).toHaveURL('/add-book');
      
      // Step 4: Go back to book detail
      await page.goBack();
      await expect(page.getByRole('heading', { name: 'Pride and Prejudice' })).toBeVisible();
      
      // Step 5: Go back to home
      await page.goBack();
      await expect(page).toHaveURL('/');
      
      // Step 6: Go forward to book detail
      await page.goForward();
      await expect(page.getByRole('heading', { name: 'Pride and Prejudice' })).toBeVisible();
    });
  });

  test.describe('Journey 6: User Viewing Multiple Books', () => {
    test('should allow user to view details of multiple books in sequence', async ({ page }) => {
      const booksToView = [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
        { title: '1984', author: 'George Orwell' },
        { title: 'Pride and Prejudice', author: 'Jane Austen' },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien' }
      ];
      
      await page.goto('/');
      
      for (const book of booksToView) {
        // Click on book
        await page.getByText(book.title).click();
        
        // Verify details
        await expect(page.getByRole('heading', { name: book.title })).toBeVisible();
        await expect(page.getByText(`by ${book.author}`)).toBeVisible();
        
        // Go back to library
        await page.getByText('← Back to Library').first().click();
        await expect(page).toHaveURL('/');
      }
    });
  });

  test.describe('Journey 7: User Adding Book with Minimum Required Fields', () => {
    test('should successfully add a book with only required fields', async ({ page }) => {
      const minimalTitle = `Minimal Book ${Date.now()}`;
      
      // Navigate to add book
      await page.goto('/add-book');
      
      // Fill only required fields
      await page.getByLabel('Title *').fill(minimalTitle);
      await page.getByLabel('Author *').fill('Minimal Author');
      
      // Submit
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      // Verify success
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
      await page.waitForURL(/\/book\/\d+/);
      
      // Verify default values are displayed
      await expect(page.getByRole('heading', { name: minimalTitle })).toBeVisible();
      await expect(page.getByText('Unknown')).toBeVisible(); // Default genre
    });
  });
});

test.describe('User Journeys - Accessibility', () => {
  test('should allow keyboard-only navigation through the entire app', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first book
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Press Enter to select book
    await page.keyboard.press('Enter');
    
    // Should navigate to book detail
    await expect(page).toHaveURL(/\/book\/\d+/);
    
    // Tab to back link
    await page.keyboard.press('Tab');
    
    // Press Enter to go back
    await page.keyboard.press('Enter');
    
    // Should be back on home page
    await expect(page).toHaveURL('/');
  });
});

test.describe('User Journeys - Data Persistence', () => {
  test('should persist newly added books across page navigation', async ({ page }) => {
    const persistentTitle = `Persistent Book ${Date.now()}`;
    
    // Add a book
    await page.goto('/add-book');
    await page.getByLabel('Title *').fill(persistentTitle);
    await page.getByLabel('Author *').fill('Persistent Author');
    await page.getByRole('button', { name: 'Add Book' }).click();
    
    await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    await page.waitForURL(/\/book\/\d+/);
    
    // Navigate away and back
    await page.goto('/');
    await expect(page.getByText(persistentTitle)).toBeVisible();
    
    // Click on the new book
    await page.getByText(persistentTitle).click();
    await expect(page.getByRole('heading', { name: persistentTitle })).toBeVisible();
  });
});
