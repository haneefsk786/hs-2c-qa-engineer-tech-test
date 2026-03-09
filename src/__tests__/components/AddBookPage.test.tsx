import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Add Book Page Component Tests
 * 
 * Tests the Add Book form component functionality including:
 * - Form rendering
 * - Input validation
 * - Form submission
 * - Error handling
 */

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Add Book Page Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Form Rendering', () => {
    it('should display page title', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByText('Add New Book')).toBeInTheDocument();
    });

    it('should display back to library link', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByText('← Back to Library')).toBeInTheDocument();
    });

    it('should display title input field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    });

    it('should display author input field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Author *')).toBeInTheDocument();
    });

    it('should display genre select field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Genre')).toBeInTheDocument();
    });

    it('should display published year input', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Published Year')).toBeInTheDocument();
    });

    it('should display pages input', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Pages')).toBeInTheDocument();
    });

    it('should display ISBN input', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('ISBN')).toBeInTheDocument();
    });

    it('should display rating input', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Rating (1-5)')).toBeInTheDocument();
    });

    it('should display description textarea', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('should display submit button', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByRole('button', { name: 'Add Book' })).toBeInTheDocument();
    });

    it('should display cancel button', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Form Input', () => {
    it('should allow typing in title field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText('Title *');
      await user.type(titleInput, 'Test Book Title');

      expect(titleInput).toHaveValue('Test Book Title');
    });

    it('should allow typing in author field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);
      const user = userEvent.setup();

      const authorInput = screen.getByLabelText('Author *');
      await user.type(authorInput, 'Test Author');

      expect(authorInput).toHaveValue('Test Author');
    });

    it('should allow selecting genre', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);
      const user = userEvent.setup();

      const genreSelect = screen.getByLabelText('Genre');
      await user.selectOptions(genreSelect, 'Fiction');

      expect(genreSelect).toHaveValue('Fiction');
    });

    it('should allow typing in description', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);
      const user = userEvent.setup();

      const descriptionInput = screen.getByLabelText('Description');
      await user.type(descriptionInput, 'A test description');

      expect(descriptionInput).toHaveValue('A test description');
    });
  });

  describe('Form Submission', () => {
    it('should have a submit button that is clickable', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const submitButton = screen.getByRole('button', { name: 'Add Book' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('should have form with correct action structure', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const form = screen.getByRole('button', { name: 'Add Book' }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should have required attribute on title field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const titleInput = screen.getByLabelText('Title *');
      expect(titleInput).toHaveAttribute('required');
    });

    it('should have required attribute on author field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const authorInput = screen.getByLabelText('Author *');
      expect(authorInput).toHaveAttribute('required');
    });

    it('should have min attribute on rating field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const ratingInput = screen.getByLabelText('Rating (1-5)');
      expect(ratingInput).toHaveAttribute('min', '0');
      expect(ratingInput).toHaveAttribute('max', '5');
    });

    it('should have min attribute on pages field', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const pagesInput = screen.getByLabelText('Pages');
      expect(pagesInput).toHaveAttribute('min', '1');
    });
  });

  describe('Genre Options', () => {
    it('should have genre select with options', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const genreSelect = screen.getByLabelText('Genre');
      expect(genreSelect).toBeInTheDocument();
      expect(genreSelect.tagName).toBe('SELECT');
      
      // Check for at least the default option
      expect(screen.getByText('Select genre')).toBeInTheDocument();
    });

    it('should allow selecting Fiction genre', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);
      const user = userEvent.setup();

      const genreSelect = screen.getByLabelText('Genre');
      await user.selectOptions(genreSelect, 'Fiction');
      expect(genreSelect).toHaveValue('Fiction');
    });

    it('should allow selecting Fantasy genre', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);
      const user = userEvent.setup();

      const genreSelect = screen.getByLabelText('Genre');
      await user.selectOptions(genreSelect, 'Fantasy');
      expect(genreSelect).toHaveValue('Fantasy');
    });
  });

  describe('Navigation', () => {
    it('should have correct href for back link', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const backLink = screen.getByText('← Back to Library').closest('a');
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('should have correct href for cancel link', async () => {
      const AddBook = (await import('@/app/add-book/page')).default;
      render(<AddBook />);

      const cancelLink = screen.getByText('Cancel').closest('a');
      expect(cancelLink).toHaveAttribute('href', '/');
    });
  });
});
