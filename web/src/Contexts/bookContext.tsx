import React, { useState, createContext, ReactNode } from "react";
import { BookProps, BookType } from "./bookType";

export interface ChildrenProps {
  children: React.ReactNode;
}

export const BookContext = createContext<BookType | null>(null);

export const BookContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [book, setBook] = useState({} as BookProps);
  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <BookContext.Provider value={{ book, setBook, isUpdate, setIsUpdate }}>
      {children}
    </BookContext.Provider>
  );
};
