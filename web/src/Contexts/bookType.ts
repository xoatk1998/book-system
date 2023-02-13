export interface BookProps {
  id: string;
  title: string;
  author: string;
  isbn: string;
}

export type BookListType = {
  bookList: BookProps[];
  addBook: (book: BookProps) => void;
  updateBook: (book: BookProps) => void;
  deleteBook: (id: string) => void;
  page: number;
  totalPage: number;
  setPage: Function;
  setTotalPage: Function;
};

export type BookType = {
  book: BookProps;
  setBook: Function;
  isUpdate: boolean;
  setIsUpdate: Function;
};
