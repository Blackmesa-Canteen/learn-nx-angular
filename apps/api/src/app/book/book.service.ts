import { Injectable } from '@nestjs/common';
import { Book } from '@angular-demo/models';

@Injectable()
export class BookService {
  private books: Book[] = [
    new Book('The Great Gatsby', 'F. Scott Fitzgerald', 'A novel of the Jazz Age', 1),
    new Book('To Kill a Mockingbird', 'Harper Lee', 'A gripping tale of racial injustice', 2),
  ];

  private nextId = 3;

  getAllBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  createBook(book: Omit<Book, 'id'>): Book {
    const newBook = new Book(book.name, book.author, book.description, this.nextId++);
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id: number, book: Omit<Book, 'id'>): Book | undefined {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return undefined;

    const updatedBook = new Book(book.name, book.author, book.description, id);
    this.books[index] = updatedBook;
    return updatedBook;
  }

  deleteBook(id: number): boolean {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.books.splice(index, 1);
    return true;
  }
}
