import React from "react";
import * as S from "./styles";
import { DeleteType } from "../../Contexts/deleteType";
import { DeleteContext } from "../../Contexts/deleteContext";
import { useContext } from "react";
import { BookListContext } from "../../Contexts/bookListContext";
import { BookListType } from "../../Contexts/bookType";

const DeleteModal: React.FC = () => {
  const { setShowDelete, id, setId } = useContext(DeleteContext) as DeleteType;
  const { deleteBook } = useContext(BookListContext) as BookListType;

  function handleCancel() {
    setShowDelete(false);
  }

  function handleConfirm() {
    deleteBook(id);
    setId(0);
    setShowDelete(false);
  }

  return (
    <S.Background>
      <S.Container>
        <S.Text>Are you sure you want to delete this book?</S.Text>
        <S.Buttons>
          <S.CancelButton onClick={handleCancel}>Cancel</S.CancelButton>
          <S.DeleteButton onClick={handleConfirm}>Delete</S.DeleteButton>
        </S.Buttons>
      </S.Container>
    </S.Background>
  );
};

export default DeleteModal;
