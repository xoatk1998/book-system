import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { BookProps, BookListType } from "./bookType";
import axios from "axios";
import BooksService from "../Services/books.service";
import { HTTP_STATUS } from "./constant";
import AuthContext, { AuthType } from "./authContext";
import { AddType } from "./addType";
import { AddContext } from "./addContext";

interface ChildrenProps {
  children: React.ReactNode;
}

export const BookListContext = createContext<BookListType | null>(null);

export const BookListContextProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const [bookList, setBookList] = useState<BookProps[]>([]);
  const [isReload, setIsReload] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const perPage = 3;
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const config = {
        headers: {
          "access-token": token,
        },
      };
      const { data: result, headers } = await axios.get(
        `http://127.0.0.1:3004/books?perPage=${perPage}&page=${page}`,
        config
      );
      const data = result.items.map((book: any) => {
        return {
          id: book._id,
          author: book.author,
          title: book.title,
          isbn: book.isbn,
        };
      });
      setBookList(data);
      setTotalPage(+headers["x-pages-count"]);
    }
    fetchData();
  }, [isReload, page]);

  const addBook = async (book: BookProps) => {
    const addBookResult: any = await BooksService.addBookAPI(book);
    if (addBookResult?.status === HTTP_STATUS.CREATED) {
      bookList.unshift(book);
      setIsReload(true);
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  };

  const updateBook = async (book: BookProps) => {
    const updateBookResult: any = await BooksService.updateBookAPI(book);
    if (updateBookResult?.status === HTTP_STATUS.OK) {
      setIsReload(true);
      return {
        success: true,
      };
    }

    return {
      success: false,
    };
  };

  const deleteBook = async (id: string) => {
    const deleteResult: any = await BooksService.deleteBookAPI(id);
    if (deleteResult?.status === HTTP_STATUS.NO_CONTENT) {
      const index = bookList.findIndex((book: BookProps) => book.id == id);
      bookList.splice(index, 1);
      setBookList([...bookList]);
    }
  };

  return (
    <BookListContext.Provider
      value={{
        bookList,
        addBook,
        updateBook,
        deleteBook,
        page,
        setPage,
        totalPage,
        setTotalPage,
      }}
    >
      {children}
    </BookListContext.Provider>
  );
};
