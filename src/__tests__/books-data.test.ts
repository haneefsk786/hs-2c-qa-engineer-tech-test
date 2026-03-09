import { describe, it, expect, beforeEach } from 'vitest';
import { 
  Book, 
  booksData, 
  addBook, 
  getBooks, 
  getBookById 
} from '@/lib/books-data';

describe('Books Data Utility Functions', () => {
  describe('getBooks', () => {
    it('should return an array of books', () => {
      const books = getBooks();
      
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    it('should return books with correct structure', () => {
      const books = getBooks();
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

    it('should include The Great Gatsby in initial data', () => {
      const books = getBooks();
      const gatsby = books.find(book => book.title === 'The Great Gatsby');
      
      expect(gatsby).toBeDefined();
      expect(gatsby?.author).toBe('F. Scott Fitzgerald');
      expect(gatsby?.genre).toBe('Classic');
      expect(gatsby?.publishedYear).toBe(1925);
    });

    it('should include all 5 initial books', () => {
      const books = getBooks();
      const initialTitles = [
        'The Great Gatsby',
        'To Kill a Mockingbird',
        '1984',
        'Pride and Prejudice',
        'The Hobbit'
      ];
      
      initialTitles.forEach(title => {
        const found = books.find(book => book.title === title);
        expect(found).toBeDefined();
      });
    });

    it('should return reference to booksData array', () => {
      const books = getBooks();
      
      expect(books).toBe(booksData);
    });
  });

  describe('getBookById', () => {
    it('should return a book when valid ID is provided', () => {
      const book = getBookById(1);
      
      expect(book).toBeDefined();
      expect(book?.id).toBe(1);
      expect(book?.title).toBe('The Great Gatsby');
    });

    it('should return undefined for non-existent ID', () => {
      const book = getBookById(9999);
      
      expect(book).toBeUndefined();
    });

    it('should return undefined for negative ID', () => {
      const book = getBookById(-1);
      
      expect(book).toBeUndefined();
    });

    it('should return undefined for zero ID', () => {
      const book = getBookById(0);
      
      expect(book).toBeUndefined();
    });

    it('should return correct book for each initial book ID', () => {
      const expectedBooks = [
        { id: 1, title: 'The Great Gatsby' },
        { id: 2, title: 'To Kill a Mockingbird' },
        { id: 3, title: '1984' },
        { id: 4, title: 'Pride and Prejudice' },
        { id: 5, title: 'The Hobbit' }
      ];

      expectedBooks.forEach(expected => {
        const book = getBookById(expected.id);
        expect(book?.title).toBe(expected.title);
      });
    });

    it('should return complete book details', () => {
      const book = getBookById(2);
      
      expect(book?.title).toBe('To Kill a Mockingbird');
      expect(book?.author).toBe('Harper Lee');
      expect(book?.genre).toBe('Classic');
      expect(book?.publishedYear).toBe(1960);
      expect(book?.pages).toBe(281);
      expect(book?.rating).toBe(4.3);
      expect(book?.isbn).toBe('978-0446310789');
    });
  });

  describe('addBook', () => {
    it('should add a new book and return it with an ID', () => {
      const initialCount = booksData.length;
      const newBook: Omit<Book, 'id'> = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        publishedYear: 2024,
        description: 'Test Description',
        isbn: '978-1234567890',
        pages: 200,
        rating: 4.0
      };

      const addedBook = addBook(newBook);

      expect(addedBook.id).toBeDefined();
      expect(typeof addedBook.id).toBe('number');
      expect(addedBook.title).toBe('Test Book');
      expect(addedBook.author).toBe('Test Author');
      expect(booksData.length).toBe(initialCount + 1);
    });

    it('should auto-increment ID for new books', () => {
      const maxId = Math.max(...booksData.map(b => b.id));
      
      const newBook: Omit<Book, 'id'> = {
        title: 'Auto ID Test',
        author: 'Auto Author',
        genre: 'Test',
        publishedYear: 2024,
        description: 'Test',
        isbn: '123',
        pages: 100,
        rating: 3.0
      };

      const addedBook = addBook(newBook);
      
      expect(addedBook.id).toBe(maxId + 1);
    });

    it('should preserve all provided book properties', () => {
      const newBook: Omit<Book, 'id'> = {
        title: 'Complete Test',
        author: 'Complete Author',
        genre: 'Complete Genre',
        publishedYear: 2023,
        description: 'A complete description for testing',
        isbn: '978-9876543210',
        pages: 350,
        rating: 4.8
      };

      const addedBook = addBook(newBook);

      expect(addedBook.title).toBe('Complete Test');
      expect(addedBook.author).toBe('Complete Author');
      expect(addedBook.genre).toBe('Complete Genre');
      expect(addedBook.publishedYear).toBe(2023);
      expect(addedBook.description).toBe('A complete description for testing');
      expect(addedBook.isbn).toBe('978-9876543210');
      expect(addedBook.pages).toBe(350);
      expect(addedBook.rating).toBe(4.8);
    });

    it('should make the new book retrievable by ID', () => {
      const newBook: Omit<Book, 'id'> = {
        title: 'Retrievable Test',
        author: 'Retrievable Author',
        genre: 'Test',
        publishedYear: 2024,
        description: 'Test',
        isbn: '123',
        pages: 100,
        rating: 3.0
      };

      const addedBook = addBook(newBook);
      const retrievedBook = getBookById(addedBook.id);

      expect(retrievedBook).toBeDefined();
      expect(retrievedBook?.title).toBe('Retrievable Test');
    });

    it('should make the new book appear in getBooks list', () => {
      const newBook: Omit<Book, 'id'> = {
        title: 'List Test Book',
        author: 'List Author',
        genre: 'Test',
        publishedYear: 2024,
        description: 'Test',
        isbn: '123',
        pages: 100,
        rating: 3.0
      };

      addBook(newBook);
      const books = getBooks();
      const found = books.find(b => b.title === 'List Test Book');

      expect(found).toBeDefined();
    });
  });

  describe('booksData structure', () => {
    it('should have unique IDs for all books', () => {
      const ids = booksData.map(book => book.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have valid rating values (0-5)', () => {
      booksData.forEach(book => {
        expect(book.rating).toBeGreaterThanOrEqual(0);
        expect(book.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have valid page counts (positive numbers)', () => {
      booksData.forEach(book => {
        expect(book.pages).toBeGreaterThan(0);
      });
    });

    it('should have valid published years', () => {
      const currentYear = new Date().getFullYear();
      booksData.forEach(book => {
        expect(book.publishedYear).toBeGreaterThan(1000);
        expect(book.publishedYear).toBeLessThanOrEqual(currentYear + 1);
      });
    });

    it('should have non-empty titles', () => {
      booksData.forEach(book => {
        expect(book.title.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty authors', () => {
      booksData.forEach(book => {
        expect(book.author.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Book interface', () => {
    it('should enforce correct types for Book properties', () => {
      const book: Book = {
        id: 100,
        title: 'Type Test Book',
        author: 'Type Author',
        genre: 'Type Genre',
        publishedYear: 2024,
        description: 'Type Description',
        isbn: '123-456',
        pages: 100,
        rating: 4.5
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
});
