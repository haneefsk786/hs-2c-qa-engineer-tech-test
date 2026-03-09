import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API Route Handlers', () => {
  describe('GET /api/books', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should be exported as async function', async () => {
      const { GET } = await import('@/app/api/books/route');
      expect(typeof GET).toBe('function');
    });

    it('should return NextResponse', async () => {
      const { GET } = await import('@/app/api/books/route');
      const response = await GET();
      
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it('should return JSON array of books', async () => {
      const { GET } = await import('@/app/api/books/route');
      const response = await GET();
      const data = await response.json();
      
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/books', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should be exported as async function', async () => {
      const { POST } = await import('@/app/api/books/route');
      expect(typeof POST).toBe('function');
    });

    it('should create a book with valid data', async () => {
      const { POST } = await import('@/app/api/books/route');
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: 'Test Book',
          author: 'Test Author'
        })
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.title).toBe('Test Book');
      expect(data.author).toBe('Test Author');
      expect(data.id).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
      const { POST } = await import('@/app/api/books/route');
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          author: 'Test Author'
        })
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Title and author are required');
    });

    it('should return 400 when author is missing', async () => {
      const { POST } = await import('@/app/api/books/route');
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: 'Test Title'
        })
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Title and author are required');
    });

    it('should return 400 for invalid JSON', async () => {
      const { POST } = await import('@/app/api/books/route');
      
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid JSON');
    });

    it('should set default values for optional fields', async () => {
      const { POST } = await import('@/app/api/books/route');
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: 'Defaults Test',
          author: 'Defaults Author'
        })
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();
      
      expect(data.genre).toBe('Unknown');
      expect(data.description).toBe('No description available.');
      expect(data.isbn).toBe('N/A');
      expect(data.pages).toBe(0);
      expect(data.rating).toBe(0);
    });

    it('should preserve provided optional fields', async () => {
      const { POST } = await import('@/app/api/books/route');
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          title: 'Complete Book',
          author: 'Complete Author',
          genre: 'Science Fiction',
          publishedYear: 2024,
          description: 'A complete description',
          isbn: '978-1234567890',
          pages: 400,
          rating: 4.7
        })
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();
      
      expect(data.genre).toBe('Science Fiction');
      expect(data.publishedYear).toBe(2024);
      expect(data.description).toBe('A complete description');
      expect(data.pages).toBe(400);
      expect(data.rating).toBe(4.7);
    });
  });

  describe('GET /api/books/[id]', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should be exported as async function', async () => {
      const { GET } = await import('@/app/api/books/[id]/route');
      expect(typeof GET).toBe('function');
    });

    it('should return a book for valid ID', async () => {
      const { GET } = await import('@/app/api/books/[id]/route');
      
      const mockRequest = {} as Request;
      const mockParams = { params: Promise.resolve({ id: '1' }) };

      const response = await GET(mockRequest as any, mockParams as any);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.title).toBe('The Great Gatsby');
    });

    it('should return 404 for non-existent ID', async () => {
      const { GET } = await import('@/app/api/books/[id]/route');
      
      const mockRequest = {} as Request;
      const mockParams = { params: Promise.resolve({ id: '9999' }) };

      const response = await GET(mockRequest as any, mockParams as any);
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data.error).toBe('Book not found');
    });

    it('should handle invalid ID format', async () => {
      const { GET } = await import('@/app/api/books/[id]/route');
      
      const mockRequest = {} as Request;
      const mockParams = { params: Promise.resolve({ id: 'invalid' }) };

      const response = await GET(mockRequest as any, mockParams as any);
      
      expect(response.status).toBe(404);
    });
  });
});

describe('API Response Structure', () => {
  it('should return consistent JSON structure for success', async () => {
    const { GET } = await import('@/app/api/books/route');
    const response = await GET();
    const data = await response.json();
    
    if (data.length > 0) {
      const book = data[0];
      const requiredKeys = ['id', 'title', 'author', 'genre', 'publishedYear', 'description', 'isbn', 'pages', 'rating'];
      
      requiredKeys.forEach(key => {
        expect(book).toHaveProperty(key);
      });
    }
  });

  it('should return consistent error structure', async () => {
    const { POST } = await import('@/app/api/books/route');
    
    const mockRequest = {
      json: vi.fn().mockResolvedValue({})
    } as unknown as Request;

    const response = await POST(mockRequest as any);
    const data = await response.json();
    
    expect(data).toHaveProperty('error');
    expect(typeof data.error).toBe('string');
  });
});

describe('API Error Handling', () => {
  it('should handle network-like errors gracefully', async () => {
    const { POST } = await import('@/app/api/books/route');
    
    const mockRequest = {
      json: vi.fn().mockRejectedValue(new Error('Network error'))
    } as unknown as Request;

    const response = await POST(mockRequest as any);
    
    expect(response.status).toBe(400);
  });

  it('should return proper HTTP status codes', async () => {
    const { GET } = await import('@/app/api/books/route');
    const { GET: getById } = await import('@/app/api/books/[id]/route');
    
    const listResponse = await GET();
    expect([200, 201]).toContain(listResponse.status);
    
    const mockParams = { params: Promise.resolve({ id: '9999' }) };
    const notFoundResponse = await getById({} as any, mockParams as any);
    expect(notFoundResponse.status).toBe(404);
  });
});
