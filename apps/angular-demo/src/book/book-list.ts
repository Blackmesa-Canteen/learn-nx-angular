import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '@angular-demo/models';
import { ListItem } from '@angular-demo/ui';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, ListItem, ListItem],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  books: Book[] = [
    new Book(
      'The Great Gatsby',
      'F. Scott Fitzgerald',
      'A classic American novel about the pursuit of the American Dream',
      1
    ),
    new Book(
      'To Kill a Mockingbird',
      'Harper Lee',
      'A story of racial injustice and childhood innocence in the American South',
      2
    ),
    new Book(
      '1984',
      'George Orwell',
      'A dystopian novel depicting a totalitarian society',
      3
    ),
    new Book(
      'Pride and Prejudice',
      'Jane Austen',
      'A romantic novel of manners and marriage in Georgian England',
      4
    ),
    new Book(
      'The Catcher in the Rye',
      'J.D. Salinger',
      'A coming-of-age novel following a teenage protagonist in New York City',
      5
    ),
  ];
}
