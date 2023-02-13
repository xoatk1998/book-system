import React, { useContext } from "react";
import * as S from "./styles";
import Edit from "../../Img/edit.svg";
import Erase from "../../Img/erase.svg";
import { BookType } from "../../Contexts/bookType";
import { DeleteContext } from "../../Contexts/deleteContext";
import { DeleteType } from "../../Contexts/deleteType";
import { AddContext } from "../../Contexts/addContext";
import { AddType } from "../../Contexts/addType";
import { BookContext } from "../../Contexts/bookContext";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  isbn: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, author, isbn }) => {
  const { setShowDelete, setId } = useContext(DeleteContext) as DeleteType;
  const { setBook, setIsUpdate } = useContext(BookContext) as BookType;
  const { setShowAdd } = useContext(AddContext) as AddType;

  function handleUpdate() {
    setShowAdd(true);
    setBook({
      id,
      title,
      author,
      isbn,
    });
    setIsUpdate(true);
  }

  function handleDelete() {
    setShowDelete(true);
    setId(id);
  }

  return (
    <S.Container>
      <S.Description>
        <S.Name>{title}</S.Name>
        <S.ListBelong>
          <S.ListName>ISBN: {isbn}</S.ListName>
          <S.ListName>{author}</S.ListName>
        </S.ListBelong>
      </S.Description>

      <S.Icon src={Edit} onClick={handleUpdate} />
      <S.Icon src={Erase} onClick={handleDelete} />
    </S.Container>
  );
};

export default BookCard;
