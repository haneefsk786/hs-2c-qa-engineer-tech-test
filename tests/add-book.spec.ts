import { test, expect } from '@playwright/test';

test.describe('Add Book Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add-book');
  });

  test.describe('Page Layout', () => {
    test('should display page title', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Add New Book' })).toBeVisible();
    });

    test('should display back to library link', async ({ page }) => {
      await expect(page.getByText('← Back to Library')).toBeVisible();
    });

    test('should navigate back to home when clicking back link', async ({ page }) => {
      await page.getByText('← Back to Library').click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Form Fields', () => {
    test('should display title input field with label', async ({ page }) => {
      await expect(page.getByLabel('Title *')).toBeVisible();
      await expect(page.getByPlaceholder('Enter book title')).toBeVisible();
    });

    test('should display author input field with label', async ({ page }) => {
      await expect(page.getByLabel('Author *')).toBeVisible();
      await expect(page.getByPlaceholder('Enter author name')).toBeVisible();
    });

    test('should display genre dropdown', async ({ page }) => {
      await expect(page.getByLabel('Genre')).toBeVisible();
      await expect(page.getByText('Select genre')).toBeVisible();
    });

    test('should display published year input', async ({ page }) => {
      await expect(page.getByLabel('Published Year')).toBeVisible();
    });

    test('should display pages input', async ({ page }) => {
      await expect(page.getByLabel('Pages')).toBeVisible();
    });

    test('should display ISBN input', async ({ page }) => {
      await expect(page.getByLabel('ISBN')).toBeVisible();
      await expect(page.getByPlaceholder('ISBN number')).toBeVisible();
    });

    test('should display rating input', async ({ page }) => {
      await expect(page.getByLabel('Rating (1-5)')).toBeVisible();
    });

    test('should display description textarea', async ({ page }) => {
      await expect(page.getByLabel('Description')).toBeVisible();
      await expect(page.getByPlaceholder('Enter book description')).toBeVisible();
    });

    test('should display submit and cancel buttons', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Add Book' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible();
    });
  });

  test.describe('Genre Dropdown Options', () => {
    test('should contain all genre options', async ({ page }) => {
      const genreSelect = page.getByLabel('Genre');
      await genreSelect.click();
      
      const expectedGenres = [
        'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 
        'Science Fiction', 'Fantasy', 'Thriller', 'Biography',
        'History', 'Classic', 'Dystopian', 'Other'
      ];
      
      for (const genre of expectedGenres) {
        await expect(genreSelect.locator(`option[value="${genre}"]`)).toBeAttached();
      }
    });
  });

  test.describe('Form Validation - Required Fields', () => {
    test('should require title field', async ({ page }) => {
      const titleInput = page.getByLabel('Title *');
      await expect(titleInput).toHaveAttribute('required');
    });

    test('should require author field', async ({ page }) => {
      const authorInput = page.getByLabel('Author *');
      await expect(authorInput).toHaveAttribute('required');
    });

    test('should not submit form with empty required fields', async ({ page }) => {
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page).toHaveURL('/add-book');
    });

    test('should not submit when only title is filled', async ({ page }) => {
      await page.getByLabel('Title *').fill('Test Book');
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page).toHaveURL('/add-book');
    });

    test('should not submit when only author is filled', async ({ page }) => {
      await page.getByLabel('Author *').fill('Test Author');
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page).toHaveURL('/add-book');
    });
  });

  test.describe('Form Input Behavior', () => {
    test('should accept text input in title field', async ({ page }) => {
      const titleInput = page.getByLabel('Title *');
      await titleInput.fill('My Test Book');
      await expect(titleInput).toHaveValue('My Test Book');
    });

    test('should accept text input in author field', async ({ page }) => {
      const authorInput = page.getByLabel('Author *');
      await authorInput.fill('John Doe');
      await expect(authorInput).toHaveValue('John Doe');
    });

    test('should allow selecting genre from dropdown', async ({ page }) => {
      const genreSelect = page.getByLabel('Genre');
      await genreSelect.selectOption('Fiction');
      await expect(genreSelect).toHaveValue('Fiction');
    });

    test('should accept numeric input in pages field', async ({ page }) => {
      const pagesInput = page.getByLabel('Pages');
      await pagesInput.fill('250');
      await expect(pagesInput).toHaveValue('250');
    });

    test('should accept numeric input with decimals in rating field', async ({ page }) => {
      const ratingInput = page.getByLabel('Rating (1-5)');
      await ratingInput.fill('4.5');
      await expect(ratingInput).toHaveValue('4.5');
    });

    test('should accept text in description textarea', async ({ page }) => {
      const descriptionInput = page.getByLabel('Description');
      await descriptionInput.fill('This is a test description.');
      await expect(descriptionInput).toHaveValue('This is a test description.');
    });

    test('should have min/max constraints on published year', async ({ page }) => {
      const yearInput = page.getByLabel('Published Year');
      await expect(yearInput).toHaveAttribute('min', '1000');
    });

    test('should have min/max constraints on rating', async ({ page }) => {
      const ratingInput = page.getByLabel('Rating (1-5)');
      await expect(ratingInput).toHaveAttribute('min', '0');
      await expect(ratingInput).toHaveAttribute('max', '5');
    });

    test('should have min constraint on pages', async ({ page }) => {
      const pagesInput = page.getByLabel('Pages');
      await expect(pagesInput).toHaveAttribute('min', '1');
    });
  });

  test.describe('Successful Form Submission', () => {
    test('should submit form with required fields only', async ({ page }) => {
      await page.getByLabel('Title *').fill('Minimal Test Book');
      await page.getByLabel('Author *').fill('Test Author');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Redirecting to book details...')).toBeVisible();
    });

    test('should submit form with all fields filled', async ({ page }) => {
      await page.getByLabel('Title *').fill('Complete Test Book');
      await page.getByLabel('Author *').fill('Complete Author');
      await page.getByLabel('Genre').selectOption('Fiction');
      await page.getByLabel('Published Year').fill('2024');
      await page.getByLabel('Pages').fill('300');
      await page.getByLabel('ISBN').fill('978-1234567890');
      await page.getByLabel('Rating (1-5)').fill('4.5');
      await page.getByLabel('Description').fill('A complete test book description.');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    });

    test('should redirect to book detail page after successful submission', async ({ page }) => {
      await page.getByLabel('Title *').fill('Redirect Test Book');
      await page.getByLabel('Author *').fill('Redirect Author');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
      await expect(page).toHaveURL(/\/book\/\d+/, { timeout: 5000 });
    });

    test('should display loading state during submission', async ({ page }) => {
      await page.getByLabel('Title *').fill('Loading Test Book');
      await page.getByLabel('Author *').fill('Loading Author');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      
      await expect(page.getByRole('button', { name: 'Adding Book...' })).toBeVisible();
    });
  });

  test.describe('Cancel Button', () => {
    test('should navigate to home when clicking cancel', async ({ page }) => {
      await page.getByRole('link', { name: 'Cancel' }).click();
      await expect(page).toHaveURL('/');
    });

    test('should not save data when canceling', async ({ page }) => {
      await page.getByLabel('Title *').fill('Should Not Save');
      await page.getByLabel('Author *').fill('Cancel Author');
      
      await page.getByRole('link', { name: 'Cancel' }).click();
      await expect(page).toHaveURL('/');
      
      await expect(page.getByText('Should Not Save')).not.toBeVisible();
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have associated labels for all inputs', async ({ page }) => {
      const titleInput = page.locator('#title');
      await expect(titleInput).toBeVisible();
      
      const authorInput = page.locator('#author');
      await expect(authorInput).toBeVisible();
    });

    test('should indicate required fields visually with asterisk', async ({ page }) => {
      await expect(page.getByText('Title *')).toBeVisible();
      await expect(page.getByText('Author *')).toBeVisible();
    });

    test('should be navigable by keyboard', async ({ page }) => {
      await page.getByLabel('Title *').focus();
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveAttribute('name', 'author');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle very long title input', async ({ page }) => {
      const longTitle = 'A'.repeat(500);
      await page.getByLabel('Title *').fill(longTitle);
      await page.getByLabel('Author *').fill('Test Author');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    });

    test('should handle special characters in title', async ({ page }) => {
      await page.getByLabel('Title *').fill('Book: A "Special" Title! @#$%');
      await page.getByLabel('Author *').fill("O'Connor & Smith");
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    });

    test('should handle unicode characters', async ({ page }) => {
      await page.getByLabel('Title *').fill('日本語の本 📚');
      await page.getByLabel('Author *').fill('著者名 🖋️');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    });

    test('should handle minimum valid year', async ({ page }) => {
      await page.getByLabel('Title *').fill('Ancient Book');
      await page.getByLabel('Author *').fill('Ancient Author');
      await page.getByLabel('Published Year').fill('1000');
      
      await page.getByRole('button', { name: 'Add Book' }).click();
      await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    });
  });
});

test.describe('Add Book - Complete User Journey', () => {
  test('should add a book and verify it appears in the library', async ({ page }) => {
    const uniqueTitle = `Journey Test Book ${Date.now()}`;
    
    await page.goto('/add-book');
    await page.getByLabel('Title *').fill(uniqueTitle);
    await page.getByLabel('Author *').fill('Journey Test Author');
    await page.getByLabel('Genre').selectOption('Science Fiction');
    await page.getByLabel('Pages').fill('400');
    await page.getByLabel('Rating (1-5)').fill('4.8');
    
    await page.getByRole('button', { name: 'Add Book' }).click();
    await expect(page.getByText('Book Added Successfully!')).toBeVisible({ timeout: 10000 });
    
    await page.waitForURL(/\/book\/\d+/);
    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    await expect(page.getByText('by Journey Test Author')).toBeVisible();
    
    await page.getByText('← Back to Library').first().click();
    await expect(page.getByText(uniqueTitle)).toBeVisible();
  });
});
