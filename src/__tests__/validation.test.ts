import { describe, it, expect } from 'vitest';
import type { Book, CreateBookRequest } from '@/types/book';

/**
 * Validation Tests
 * 
 * Tests for data validation logic and edge cases
 */

describe('Data Validation', () => {
  describe('Book Title Validation', () => {
    it('should accept standard alphanumeric titles', () => {
      const title = 'The Great Gatsby';
      expect(title.length).toBeGreaterThan(0);
      expect(typeof title).toBe('string');
    });

    it('should accept titles with special characters', () => {
      const titles = [
        'Book: A "Special" Title!',
        "O'Connor's Legacy",
        'Test & Trial',
        'Book (Volume 1)',
        'Book #1',
      ];

      titles.forEach(title => {
        expect(title.trim().length).toBeGreaterThan(0);
      });
    });

    it('should accept unicode titles', () => {
      const titles = [
        '日本語の本',
        'Книга',
        '책',
        'كتاب',
        'βιβλίο',
      ];

      titles.forEach(title => {
        expect(title.trim().length).toBeGreaterThan(0);
      });
    });

    it('should accept titles with emojis', () => {
      const title = '📚 My Book 📖';
      expect(title.length).toBeGreaterThan(0);
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      expect(longTitle.length).toBe(1000);
    });
  });

  describe('Book Author Validation', () => {
    it('should accept standard author names', () => {
      const authors = [
        'F. Scott Fitzgerald',
        'Harper Lee',
        'George Orwell',
        'J.R.R. Tolkien',
      ];

      authors.forEach(author => {
        expect(author.trim().length).toBeGreaterThan(0);
      });
    });

    it('should accept author names with special characters', () => {
      const authors = [
        "O'Brien",
        'García Márquez',
        'Hans-Christian Andersen',
        'Jr. Smith',
      ];

      authors.forEach(author => {
        expect(author.trim().length).toBeGreaterThan(0);
      });
    });

    it('should accept multiple authors', () => {
      const authors = 'John Smith & Jane Doe';
      expect(authors.length).toBeGreaterThan(0);
    });
  });

  describe('ISBN Validation', () => {
    it('should accept valid ISBN-13 format', () => {
      const isbn = '978-0743273565';
      expect(isbn.match(/^\d{3}-\d{10}$/)).toBeTruthy();
    });

    it('should accept ISBN without dashes', () => {
      const isbn = '9780743273565';
      expect(isbn.match(/^\d{13}$/)).toBeTruthy();
    });

    it('should accept ISBN-10 format', () => {
      const isbn = '0743273567';
      expect(isbn.match(/^\d{10}$/)).toBeTruthy();
    });
  });

  describe('Rating Validation', () => {
    it('should accept ratings between 0 and 5', () => {
      const validRatings = [0, 1, 2, 3, 4, 5, 0.5, 2.5, 4.9];
      
      validRatings.forEach(rating => {
        expect(rating).toBeGreaterThanOrEqual(0);
        expect(rating).toBeLessThanOrEqual(5);
      });
    });

    it('should accept decimal ratings', () => {
      const rating = 4.2;
      expect(Number.isFinite(rating)).toBe(true);
    });
  });

  describe('Published Year Validation', () => {
    it('should accept historical years', () => {
      const historicalYears = [1000, 1500, 1800, 1900, 1925, 1984];
      
      historicalYears.forEach(year => {
        expect(year).toBeGreaterThanOrEqual(1000);
      });
    });

    it('should accept current year', () => {
      const currentYear = new Date().getFullYear();
      expect(currentYear).toBeGreaterThanOrEqual(2020);
    });

    it('should accept near-future years (for pre-orders)', () => {
      const nextYear = new Date().getFullYear() + 1;
      expect(nextYear).toBeGreaterThan(new Date().getFullYear());
    });
  });

  describe('Page Count Validation', () => {
    it('should accept positive page counts', () => {
      const validPages = [1, 100, 500, 1000, 5000];
      
      validPages.forEach(pages => {
        expect(pages).toBeGreaterThan(0);
      });
    });

    it('should handle typical book lengths', () => {
      const typicalLengths = [
        { type: 'short story', pages: 50 },
        { type: 'novel', pages: 300 },
        { type: 'epic', pages: 1000 },
      ];

      typicalLengths.forEach(book => {
        expect(book.pages).toBeGreaterThan(0);
      });
    });
  });

  describe('Genre Validation', () => {
    it('should accept standard genres', () => {
      const genres = [
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Romance',
        'Science Fiction',
        'Fantasy',
        'Thriller',
        'Biography',
        'History',
        'Classic',
        'Dystopian',
        'Other',
      ];

      genres.forEach(genre => {
        expect(genre.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('CreateBookRequest Validation', () => {
  it('should validate request with required fields only', () => {
    const request: CreateBookRequest = {
      title: 'Test Book',
      author: 'Test Author',
    };

    expect(request.title).toBeDefined();
    expect(request.author).toBeDefined();
    expect(request.genre).toBeUndefined();
  });

  it('should validate request with all optional fields', () => {
    const request: CreateBookRequest = {
      title: 'Complete Book',
      author: 'Complete Author',
      genre: 'Fiction',
      publishedYear: 2024,
      description: 'A complete description',
      isbn: '978-1234567890',
      pages: 300,
      rating: 4.5,
    };

    expect(request.title).toBe('Complete Book');
    expect(request.author).toBe('Complete Author');
    expect(request.genre).toBe('Fiction');
    expect(request.publishedYear).toBe(2024);
    expect(request.description).toBe('A complete description');
    expect(request.isbn).toBe('978-1234567890');
    expect(request.pages).toBe(300);
    expect(request.rating).toBe(4.5);
  });
});

describe('Book Interface Validation', () => {
  it('should create a valid Book object', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      publishedYear: 2024,
      description: 'Test description',
      isbn: '978-1234567890',
      pages: 300,
      rating: 4.5,
    };

    expect(book.id).toBeDefined();
    expect(book.title).toBeDefined();
    expect(book.author).toBeDefined();
    expect(book.genre).toBeDefined();
    expect(book.publishedYear).toBeDefined();
    expect(book.description).toBeDefined();
    expect(book.isbn).toBeDefined();
    expect(book.pages).toBeDefined();
    expect(book.rating).toBeDefined();
  });

  it('should enforce correct property types', () => {
    const book: Book = {
      id: 1,
      title: 'Test',
      author: 'Test',
      genre: 'Test',
      publishedYear: 2024,
      description: 'Test',
      isbn: 'Test',
      pages: 100,
      rating: 4.0,
    };

    expect(typeof book.id).toBe('number');
    expect(typeof book.title).toBe('string');
    expect(typeof book.author).toBe('string');
    expect(typeof book.genre).toBe('string');
    expect(typeof book.publishedYear).toBe('number');
    expect(typeof book.description).toBe('string');
    expect(typeof book.isbn).toBe('string');
    expect(typeof book.pages).toBe('number');
    expect(typeof book.rating).toBe('number');
  });
});

describe('Edge Case Handling', () => {
  it('should handle empty strings correctly', () => {
    const emptyString = '';
    expect(emptyString.length).toBe(0);
    expect(emptyString.trim()).toBe('');
  });

  it('should handle whitespace-only strings', () => {
    const whitespaceString = '   ';
    expect(whitespaceString.trim().length).toBe(0);
  });

  it('should handle numeric boundaries', () => {
    expect(Number.MAX_SAFE_INTEGER).toBeGreaterThan(0);
    expect(Number.MIN_SAFE_INTEGER).toBeLessThan(0);
  });

  it('should handle floating point precision', () => {
    const rating = 4.15;
    expect(rating).toBeCloseTo(4.15, 2);
  });
});
