import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Home Page Component Tests
 * 
 * Tests the Home page component functionality including:
 * - Loading states
 * - Book list rendering
 * - Error handling
 * - User interactions
 */

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock fetch
const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    publishedYear: 1925,
    description: 'A story of decadence and excess',
    isbn: '978-0743273565',
    pages: 180,
    rating: 4.2,
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    publishedYear: 1960,
    description: 'A story about racial injustice',
    isbn: '978-0446310789',
    pages: 281,
    rating: 4.3,
  },
];

describe('Home Page Component', () => {
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
          json: () => Promise.resolve(mockBooks),
        }), 100))
      );

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      expect(screen.getByText('Loading books...')).toBeInTheDocument();
    });
  });

  describe('Successful Data Fetch', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBooks),
      });
    });

    it('should display page title after loading', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Book Library')).toBeInTheDocument();
      });
    });

    it('should display subtitle', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Discover amazing books from various genres')).toBeInTheDocument();
      });
    });

    it('should display Add New Book button', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Add New Book')).toBeInTheDocument();
      });
    });

    it('should display book titles', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
        expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument();
      });
    });

    it('should display book authors', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('by F. Scott Fitzgerald')).toBeInTheDocument();
        expect(screen.getByText('by Harper Lee')).toBeInTheDocument();
      });
    });

    it('should display book genres', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        const classicBadges = screen.getAllByText('Classic');
        expect(classicBadges.length).toBeGreaterThan(0);
      });
    });

    it('should display View details link', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        const viewDetailsLinks = screen.getAllByText('View details →');
        expect(viewDetailsLinks.length).toBeGreaterThan(0);
      });
    });

    it('should have correct href for book links', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        const bookLink = screen.getByText('The Great Gatsby').closest('a');
        expect(bookLink).toHaveAttribute('href', '/book/1');
      });
    });

    it('should have correct href for Add New Book link', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        const addBookLink = screen.getByText('Add New Book').closest('a');
        expect(addBookLink).toHaveAttribute('href', '/add-book');
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
    });

    it('should display error message text', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch books')).toBeInTheDocument();
      });
    });

    it('should display Try Again button on error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('should have clickable Try Again button', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toBeInTheDocument();
        expect(retryButton.tagName).toBe('BUTTON');
      });
    });

    it('should handle network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no books exist', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('No books found')).toBeInTheDocument();
      });
    });

    it('should display helpful message in empty state', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('Start by adding your first book!')).toBeInTheDocument();
      });
    });
  });

  describe('Book Card Display', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockBooks),
      });
    });

    it('should display book rating with star emoji', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getAllByText('⭐').length).toBeGreaterThan(0);
      });
    });

    it('should display book page count', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('180 pages')).toBeInTheDocument();
      });
    });

    it('should display published year', async () => {
      const Home = (await import('@/app/page')).default;
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('1925')).toBeInTheDocument();
      });
    });
  });
});
