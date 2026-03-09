import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test.describe('GET /api/books', () => {
    test('should return a list of books', async ({ request }) => {
      const response = await request.get('/api/books');
      
      expect(response.status()).toBe(200);
      const books = await response.json();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    test('should return books with correct structure', async ({ request }) => {
      const response = await request.get('/api/books');
      const books = await response.json();
      
      const book = books[0];
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('author');
      expect(book).toHaveProperty('genre');
      expect(book).toHaveProperty('publishedYear');
      expect(book).toHaveProperty('description');
      expect(book).toHaveProperty('isbn');
      expect(book).toHaveProperty('pages');
      expect(book).toHaveProperty('rating');
    });

    test('should return correct data types for book properties', async ({ request }) => {
      const response = await request.get('/api/books');
      const books = await response.json();
      
      const book = books[0];
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

    test('should return JSON content type', async ({ request }) => {
      const response = await request.get('/api/books');
      
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('should include "The Great Gatsby" in initial books', async ({ request }) => {
      const response = await request.get('/api/books');
      const books = await response.json();
      
      const gatsby = books.find((book: { title: string }) => book.title === 'The Great Gatsby');
      expect(gatsby).toBeDefined();
      expect(gatsby.author).toBe('F. Scott Fitzgerald');
    });
  });

  test.describe('GET /api/books/[id]', () => {
    test('should return a single book by ID', async ({ request }) => {
      const response = await request.get('/api/books/1');
      
      expect(response.status()).toBe(200);
      const book = await response.json();
      expect(book.id).toBe(1);
      expect(book.title).toBe('The Great Gatsby');
    });

    test('should return 404 for non-existent book', async ({ request }) => {
      const response = await request.get('/api/books/9999');
      
      expect(response.status()).toBe(404);
      const error = await response.json();
      expect(error.error).toBe('Book not found');
    });

    test('should return correct book for each ID', async ({ request }) => {
      const expectedBooks = [
        { id: 1, title: 'The Great Gatsby' },
        { id: 2, title: 'To Kill a Mockingbird' },
        { id: 3, title: '1984' },
        { id: 4, title: 'Pride and Prejudice' },
        { id: 5, title: 'The Hobbit' },
      ];

      for (const expected of expectedBooks) {
        const response = await request.get(`/api/books/${expected.id}`);
        expect(response.status()).toBe(200);
        const book = await response.json();
        expect(book.title).toBe(expected.title);
      }
    });

    test('should return complete book details', async ({ request }) => {
      const response = await request.get('/api/books/2');
      const book = await response.json();
      
      expect(book.title).toBe('To Kill a Mockingbird');
      expect(book.author).toBe('Harper Lee');
      expect(book.genre).toBe('Classic');
      expect(book.publishedYear).toBe(1960);
      expect(book.pages).toBe(281);
      expect(book.rating).toBe(4.3);
    });
  });

  test.describe('POST /api/books', () => {
    test('should create a new book with required fields', async ({ request }) => {
      const newBook = {
        title: 'API Test Book',
        author: 'API Test Author'
      };

      const response = await request.post('/api/books', {
        data: newBook
      });

      expect(response.status()).toBe(201);
      const createdBook = await response.json();
      expect(createdBook.id).toBeDefined();
      expect(createdBook.title).toBe('API Test Book');
      expect(createdBook.author).toBe('API Test Author');
    });

    test('should create a book with all fields', async ({ request }) => {
      const newBook = {
        title: 'Complete API Book',
        author: 'Complete Author',
        genre: 'Test Genre',
        publishedYear: 2024,
        description: 'A test description',
        isbn: '123-4567890123',
        pages: 250,
        rating: 4.5
      };

      const response = await request.post('/api/books', {
        data: newBook
      });

      expect(response.status()).toBe(201);
      const createdBook = await response.json();
      expect(createdBook.title).toBe('Complete API Book');
      expect(createdBook.genre).toBe('Test Genre');
      expect(createdBook.publishedYear).toBe(2024);
      expect(createdBook.description).toBe('A test description');
      expect(createdBook.pages).toBe(250);
      expect(createdBook.rating).toBe(4.5);
    });

    test('should return 400 when title is missing', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          author: 'Test Author'
        }
      });

      expect(response.status()).toBe(400);
      const error = await response.json();
      expect(error.error).toBe('Title and author are required');
    });

    test('should return 400 when author is missing', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: 'Test Title'
        }
      });

      expect(response.status()).toBe(400);
      const error = await response.json();
      expect(error.error).toBe('Title and author are required');
    });

    test('should return 400 when both title and author are missing', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {}
      });

      expect(response.status()).toBe(400);
      const error = await response.json();
      expect(error.error).toBe('Title and author are required');
    });

    test('should return 400 for invalid JSON', async ({ request }) => {
      const response = await request.post('/api/books', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      });

      expect(response.status()).toBe(400);
    });

    test('should assign default values for optional fields', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: 'Minimal Book',
          author: 'Minimal Author'
        }
      });

      const book = await response.json();
      expect(book.genre).toBe('Unknown');
      expect(book.description).toBe('No description available.');
      expect(book.isbn).toBe('N/A');
      expect(book.pages).toBe(0);
      expect(book.rating).toBe(0);
    });

    test('should auto-increment book ID', async ({ request }) => {
      const response1 = await request.post('/api/books', {
        data: { title: 'First Book', author: 'Author 1' }
      });
      const book1 = await response1.json();

      const response2 = await request.post('/api/books', {
        data: { title: 'Second Book', author: 'Author 2' }
      });
      const book2 = await response2.json();

      expect(book2.id).toBe(book1.id + 1);
    });

    test('newly created book should be retrievable', async ({ request }) => {
      const createResponse = await request.post('/api/books', {
        data: {
          title: 'Retrievable Book',
          author: 'Retrievable Author'
        }
      });
      const createdBook = await createResponse.json();

      const getResponse = await request.get(`/api/books/${createdBook.id}`);
      expect(getResponse.status()).toBe(200);
      const retrievedBook = await getResponse.json();
      expect(retrievedBook.title).toBe('Retrievable Book');
    });

    test('newly created book should appear in books list', async ({ request }) => {
      const uniqueTitle = `List Book ${Date.now()}`;
      await request.post('/api/books', {
        data: {
          title: uniqueTitle,
          author: 'List Author'
        }
      });

      const listResponse = await request.get('/api/books');
      const books = await listResponse.json();
      const foundBook = books.find((b: { title: string }) => b.title === uniqueTitle);
      expect(foundBook).toBeDefined();
    });
  });

  test.describe('API Edge Cases', () => {
    test('should handle empty title string', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: '',
          author: 'Test Author'
        }
      });

      expect(response.status()).toBe(400);
    });

    test('should handle empty author string', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: 'Test Title',
          author: ''
        }
      });

      expect(response.status()).toBe(400);
    });

    test('should handle special characters in title', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: 'Book: "Special" & <Characters>',
          author: "O'Brien & Co."
        }
      });

      expect(response.status()).toBe(201);
      const book = await response.json();
      expect(book.title).toBe('Book: "Special" & <Characters>');
    });

    test('should handle unicode characters', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: '日本語タイトル 📚',
          author: '著者名'
        }
      });

      expect(response.status()).toBe(201);
      const book = await response.json();
      expect(book.title).toBe('日本語タイトル 📚');
    });

    test('should handle very long strings', async ({ request }) => {
      const longTitle = 'A'.repeat(1000);
      const response = await request.post('/api/books', {
        data: {
          title: longTitle,
          author: 'Test Author'
        }
      });

      expect(response.status()).toBe(201);
    });

    test('should handle rating at boundaries', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: 'Boundary Test',
          author: 'Test Author',
          rating: 5.0
        }
      });

      expect(response.status()).toBe(201);
      const book = await response.json();
      expect(book.rating).toBe(5.0);
    });

    test('should handle negative rating gracefully', async ({ request }) => {
      const response = await request.post('/api/books', {
        data: {
          title: 'Negative Rating Test',
          author: 'Test Author',
          rating: -1
        }
      });

      expect(response.status()).toBe(201);
    });
  });
});
