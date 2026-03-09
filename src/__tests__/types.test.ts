import { describe, it, expect } from 'vitest';
import type { CreateBookRequest } from '@/types/book';

describe('TypeScript Types', () => {
  describe('CreateBookRequest Interface', () => {
    it('should allow creating request with required fields only', () => {
      const request: CreateBookRequest = {
        title: 'Test Title',
        author: 'Test Author'
      };

      expect(request.title).toBe('Test Title');
      expect(request.author).toBe('Test Author');
      expect(request.genre).toBeUndefined();
      expect(request.publishedYear).toBeUndefined();
    });

    it('should allow creating request with all fields', () => {
      const request: CreateBookRequest = {
        title: 'Complete Title',
        author: 'Complete Author',
        genre: 'Fiction',
        publishedYear: 2024,
        description: 'A complete description',
        isbn: '978-1234567890',
        pages: 300,
        rating: 4.5
      };

      expect(request.title).toBe('Complete Title');
      expect(request.author).toBe('Complete Author');
      expect(request.genre).toBe('Fiction');
      expect(request.publishedYear).toBe(2024);
      expect(request.description).toBe('A complete description');
      expect(request.isbn).toBe('978-1234567890');
      expect(request.pages).toBe(300);
      expect(request.rating).toBe(4.5);
    });

    it('should allow partial optional fields', () => {
      const request: CreateBookRequest = {
        title: 'Partial Title',
        author: 'Partial Author',
        genre: 'Mystery',
        rating: 3.5
      };

      expect(request.title).toBe('Partial Title');
      expect(request.genre).toBe('Mystery');
      expect(request.rating).toBe(3.5);
      expect(request.publishedYear).toBeUndefined();
      expect(request.pages).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('should enforce string type for title', () => {
      const request: CreateBookRequest = {
        title: 'String Title',
        author: 'Author'
      };

      expect(typeof request.title).toBe('string');
    });

    it('should enforce string type for author', () => {
      const request: CreateBookRequest = {
        title: 'Title',
        author: 'String Author'
      };

      expect(typeof request.author).toBe('string');
    });

    it('should enforce number type for publishedYear when provided', () => {
      const request: CreateBookRequest = {
        title: 'Title',
        author: 'Author',
        publishedYear: 2024
      };

      expect(typeof request.publishedYear).toBe('number');
    });

    it('should enforce number type for pages when provided', () => {
      const request: CreateBookRequest = {
        title: 'Title',
        author: 'Author',
        pages: 250
      };

      expect(typeof request.pages).toBe('number');
    });

    it('should enforce number type for rating when provided', () => {
      const request: CreateBookRequest = {
        title: 'Title',
        author: 'Author',
        rating: 4.5
      };

      expect(typeof request.rating).toBe('number');
    });
  });
});
