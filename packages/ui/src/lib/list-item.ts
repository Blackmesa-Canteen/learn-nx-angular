
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '@angular-demo/models';

@Component({
  selector: 'lib-list-item',
  imports: [CommonModule],
  template: `
    <div class="book-item">
      @if (book) {
        <h3>{{ book.name }}</h3>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>
        <small>#{{ book.id }}</small>
      } @else {
        <p>No book data available.</p>
      }
    </div>
  `,
  styles: `
    .book-item {
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 12px;
      background-color: #f9f9f9;
    }
    .book-item h3 {
      margin: 0 0 12px 0;
      color: #333;
    }
    .book-item p {
      margin: 8px 0;
      color: #666;
    }
    .book-item small {
      display: block;
      margin-top: 8px;
      color: #999;
    }
  `,
})
export class ListItem {
  @Input() book: Book | null = null;
}
