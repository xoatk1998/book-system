import React, { useContext, useState } from "react";
import * as S from "./styles";
import { AddContext } from "../../Contexts/addContext";
import { AddType } from "../../Contexts/addType";
import { BookListContext } from "../../Contexts/bookListContext";
import { BookProps, BookListType, BookType } from "../../Contexts/bookType";
import { BookContext } from "../../Contexts/bookContext";
import toast, { Toaster } from "react-hot-toast";

const AddModal: React.FC = () => {
  const { addBook, updateBook } = useContext(BookListContext) as BookListType;
  const { setShowAdd } = useContext(AddContext) as AddType;
  const { book, setBook, isUpdate, setIsUpdate } = useContext(
    BookContext
  ) as BookType;
  const [bookTitle, setbookTitle] = useState(book?.title || "");
  const [bookAuthor, setbookAuthor] = useState(book?.author || "");
  const [bookISBN, setbookISBN] = useState(book?.isbn || "");

  function handleTyping(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.id) {
      case "title":
        return setbookTitle(event.target.value);
      case "isbn":
        return setbookISBN(event.target.value);
      case "author":
        return setbookAuthor(event.target.value);
    }
  }

  function handleCancel() {
    setShowAdd(false);
  }

  function validate(book: BookProps) {
    if (!book.title || !book.author || !book.isbn) {
      return {
        errors: ["Data must not be empty"],
      };
    }
    if (book.author.length < 5) {
      return {
        errors: ["author must be longer than or equal to 5 characters"],
      };
    }
  }

  function handleAddOrUpdate() {
    const bookData: BookProps = {
      id: book.id,
      title: bookTitle,
      author: bookAuthor,
      isbn: bookISBN,
    };
    const validateResult = validate(bookData);
    if (validateResult?.errors.length) {
      validateResult.errors.map((error) => {
        toast.error(error);
      });
      return;
    }
    setBook({} as BookProps);
    isUpdate ? updateBook(bookData) : addBook(bookData);
    setShowAdd(false);
  }

  return (
    <S.Background>
      <S.Container>
        <S.Text>Insert title</S.Text>
        <S.TitleInput
          placeholder="Book title"
          onChange={handleTyping}
          id="title"
          value={bookTitle}
        />
        <S.Text>Insert author</S.Text>
        <S.TitleInput
          placeholder="Book author"
          onChange={handleTyping}
          id="author"
          value={bookAuthor}
        />
        <S.Text>Insert isbn</S.Text>
        <S.TitleInput
          placeholder="Book isbn"
          onChange={handleTyping}
          id="isbn"
          value={bookISBN}
        />
        <S.Buttons>
          <S.CancelButton onClick={handleCancel}>Cancel</S.CancelButton>
          <S.DeleteButton onClick={handleAddOrUpdate}>
            {isUpdate ? "Update" : "Add"}
          </S.DeleteButton>
        </S.Buttons>
      </S.Container>
      <Toaster position="top-right" />
    </S.Background>
  );
};

export default AddModal;
