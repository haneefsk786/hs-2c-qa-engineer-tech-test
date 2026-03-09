import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

/**
 * Book Detail Page Component Tests
 * 
 * Tests the Book Detail page component functionality including:
 * - Loading states
 * - Book information display
 * - Error handling
 * - Navigation
 */

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

const mockBook = {
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  genre: 'Classic',
  publishedYear: 1925,
  description: 'A story of decadence and excess, Gatsby explores the darker aspects of the Jazz Age.',
  isbn: '978-0743273565',
  pages: 180,
  rating: 4.2,
};

describe('Book Detail Page Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading indicator initially', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(mockBook),
        }), 100))
      );

      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      expect(screen.getByText('Loading book details...')).toBeInTheDocument();
    });
  });

  describe('Successful Data Fetch', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBook),
      });
    });

    it('should display book title', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      });
    });

    it('should display book author', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('by F. Scott Fitzgerald')).toBeInTheDocument();
      });
    });

    it('should display book rating', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('4.2')).toBeInTheDocument();
      });
    });

    it('should display star emoji', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('⭐')).toBeInTheDocument();
      });
    });

    it('should display genre label and value', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Genre')).toBeInTheDocument();
        expect(screen.getByText('Classic')).toBeInTheDocument();
      });
    });

    it('should display published year', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Published Year')).toBeInTheDocument();
        expect(screen.getByText('1925')).toBeInTheDocument();
      });
    });

    it('should display page count', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Pages')).toBeInTheDocument();
        expect(screen.getByText('180 pages')).toBeInTheDocument();
      });
    });

    it('should display ISBN', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('ISBN')).toBeInTheDocument();
        expect(screen.getByText('978-0743273565')).toBeInTheDocument();
      });
    });

    it('should display description', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText(/A story of decadence and excess/)).toBeInTheDocument();
      });
    });

    it('should display rating stars', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('(4.2/5)')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Links', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBook),
      });
    });

    it('should display Back to Library link', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('← Back to Library')).toBeInTheDocument();
      });
    });

    it('should have correct href for back link', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        const backLink = screen.getByText('← Back to Library').closest('a');
        expect(backLink).toHaveAttribute('href', '/');
      });
    });

    it('should display Add Another Book link', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Add Another Book')).toBeInTheDocument();
      });
    });

    it('should have correct href for Add Another Book link', async () => {
      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        const addBookLink = screen.getByText('Add Another Book').closest('a');
        expect(addBookLink).toHaveAttribute('href', '/add-book');
      });
    });
  });

  describe('Error State', () => {
    it('should display error for 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
    });

    it('should display Book not found message for 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Book not found')).toBeInTheDocument();
      });
    });

    it('should display back link on error page', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Back to Library')).toBeInTheDocument();
      });
    });

    it('should handle network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
    });

    it('should handle server error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const BookDetail = (await import('@/app/book/[id]/page')).default;
      render(<BookDetail />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
    });
  });
});
