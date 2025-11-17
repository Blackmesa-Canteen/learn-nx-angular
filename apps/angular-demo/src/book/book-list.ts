import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '@angular-demo/models';
import { ListItem } from '@angular-demo/ui';
import { BookDataService } from '@angular-demo/data-access';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, ListItem, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  private readonly bookService = inject(BookDataService);

  books = signal<Book[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Form state
  isFormVisible = signal(false);
  isEditMode = signal(false);
  currentBook = signal<Partial<Book>>({});

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);
    this.error.set(null);

    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load books: ' + err.message);
        this.isLoading.set(false);
        console.error('Error loading books:', err);
      }
    });
  }

  showCreateForm() {
    this.isFormVisible.set(true);
    this.isEditMode.set(false);
    this.currentBook.set({
      name: '',
      author: '',
      description: ''
    });
  }

  showEditForm(book: Book) {
    this.isFormVisible.set(true);
    this.isEditMode.set(true);
    this.currentBook.set({ ...book });
  }

  hideForm() {
    this.isFormVisible.set(false);
    this.currentBook.set({});
  }

  saveBook() {
    const book = this.currentBook();

    if (!book.name || !book.author) {
      this.error.set('Name and author are required');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    if (this.isEditMode() && book.id) {
      // Update existing book
      this.bookService.update(book.id, book as Book).subscribe({
        next: () => {
          this.loadBooks();
          this.hideForm();
        },
        error: (err) => {
          this.error.set('Failed to update book: ' + err.message);
          this.isLoading.set(false);
        }
      });
    } else {
      // Create new book
      this.bookService.create(book as Book).subscribe({
        next: () => {
          this.loadBooks();
          this.hideForm();
        },
        error: (err) => {
          this.error.set('Failed to create book: ' + err.message);
          this.isLoading.set(false);
        }
      });
    }
  }

  deleteBook(book: Book) {
    if (!book.id) return;

    if (!confirm(`Are you sure you want to delete "${book.name}"?`)) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.bookService.delete(book.id).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: (err) => {
        this.error.set('Failed to delete book: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  // ... existing code ...
  updateField(field: keyof Book, value: string) {
    this.currentBook.update(book => ({ ...book, [field]: value }));
  }

  onOverlayClick(event: MouseEvent) {
    // Optional: Close form if click is outside modal content (backdrop)
    if (event.target instanceof HTMLElement && event.target.classList.contains('modal-overlay')) {
      this.hideForm();
    }
  }

  onOverlayKeydown(event: KeyboardEvent) {
    // Close the dialog on Escape key
    if (event.key === 'Escape') {
      this.hideForm();
    }
    if (event.key === 'Enter' && event.target === event.currentTarget) {
      this.hideForm();
    }
  }
}
