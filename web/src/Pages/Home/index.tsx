import React, { useContext } from "react";
import * as S from "./styles";
import Logo from "../../Img/Book.png";
import BookFill from "../../Img/bookLogo.png";
import Logout from "../../Img/logout.svg";
import SidebarItem from "../../Components/SidebarItem";
import BookCard from "../../Components/BookCard";
import AddBook from "../../Components/AddBook";
import { BookListContext } from "../../Contexts/bookListContext";
import { BookListType } from "../../Contexts/bookType";
import { DeleteContext } from "../../Contexts/deleteContext";
import { DeleteType } from "../../Contexts/deleteType";
import DeleteModal from "../../Components/DeleteModal";
import AddModal from "../../Components/AddModal";
import { AddContext } from "../../Contexts/addContext";
import { AddType } from "../../Contexts/addType";
import { Link } from "react-router-dom";
import AuthContext, { AuthType } from "../../Contexts/authContext";
import PaginatedItems from "../../Components/Pagination";

const Home: React.FC = () => {
  const { bookList } = useContext(BookListContext) as BookListType;
  const { showDelete } = useContext(DeleteContext) as DeleteType;
  const { showAdd } = useContext(AddContext) as AddType;
  const { setUserData } = useContext(AuthContext) as AuthType;

  function handleLogout() {
    localStorage.removeItem("@Project:email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserData({ email: "" });
  }
  return (
    <S.Page>
      <S.Sidebar>
        <S.Img src={Logo} />
        <S.Tabs>
          <SidebarItem
            icon={BookFill}
            name="Books"
            isActive={true}
          ></SidebarItem>
        </S.Tabs>
        <Link
          to="/login"
          style={{ textDecoration: "none" }}
          onClick={handleLogout}
        >
          <SidebarItem
            icon={Logout}
            name="Logout"
            isActive={false}
          ></SidebarItem>
        </Link>
      </S.Sidebar>
      <S.Main>
        <S.Header>Your favourite book</S.Header>
        <S.TitleAndFilter>
          <S.Title>Books </S.Title>
          <AddBook></AddBook>
        </S.TitleAndFilter>
        {bookList.map((book) => (
          <BookCard
            id={book.id}
            title={book.title}
            author={book.author}
            isbn={book.isbn}
          />
        ))}
        <PaginatedItems></PaginatedItems>
      </S.Main>
      {showDelete && <DeleteModal />}
      {showAdd && <AddModal />}
    </S.Page>
  );
};

export default Home;
