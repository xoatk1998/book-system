import React, { useContext } from "react";
import * as S from "./styles";
import Add from "../../Img/add.svg";
import { AddType } from "../../Contexts/addType";
import { AddContext } from "../../Contexts/addContext";
import { Button } from "reactstrap";

const AddBook: React.FC = () => {
  const { setShowAdd } = useContext(AddContext) as AddType;

  function handleClick() {
    setShowAdd(true);
  }

  return (
    <Button color="success" onClick={handleClick}>
      <S.Icon src={Add} /> Add
    </Button>
  );
};

export default AddBook;
