export class Book {
  id?: number;
  name: string;
  author: string;
  description: string;

  constructor(name: string, author: string, description: string, id?: number) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.description = description;
  }
}

export interface CreateBookDto {
  name: string;
  author: string;
  description?: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}
