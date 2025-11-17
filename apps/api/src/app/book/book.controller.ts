import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from '@angular-demo/models';

@Controller('book')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @Get()
  getAllBooks(): Book[] {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  getBookById(@Param('id') id: string): Book {
    const book = this.booksService.getBookById(parseInt(id, 10));
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return book;
  }

  @Post()
  createBook(@Body() createBookDto: Omit<Book, 'id'>): Book {
    return this.booksService.createBook(createBookDto);
  }

  @Put(':id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: Omit<Book, 'id'>): Book {
    const book = this.booksService.updateBook(parseInt(id, 10), updateBookDto);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return book;
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string): { message: string } {
    const deleted = this.booksService.deleteBook(parseInt(id, 10));
    if (!deleted) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Book deleted successfully' };
  }
}
