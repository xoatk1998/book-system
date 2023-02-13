import React from "react";
import { DeleteContextProvider } from "./Contexts/deleteContext";
import { BookListContextProvider } from "./Contexts/bookListContext";
import { ChildrenProps } from "./Contexts/deleteContext";
import { AddContextProvider } from "./Contexts/addContext";
import { AuthProvider } from "./Contexts/authContext";
import { BookContextProvider } from "./Contexts/bookContext";

const ContextProviders: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <BookListContextProvider>
      <DeleteContextProvider>
        <BookContextProvider>
          <AddContextProvider>
            <AuthProvider>{children}</AuthProvider>
          </AddContextProvider>
        </BookContextProvider>
      </DeleteContextProvider>
    </BookListContextProvider>
  );
};

export default ContextProviders;
