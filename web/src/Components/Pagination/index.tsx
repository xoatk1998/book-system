import React, { useContext, useState } from "react";
import { BookListContext } from "../../Contexts/bookListContext";
import { BookListType } from "../../Contexts/bookType";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginatedItems: React.FC = () => {
  const { page, totalPage, setPage, setTotalPage } = useContext(
    BookListContext
  ) as BookListType;
  const arrayPage = Array(totalPage)
    .fill(0)
    .map((_, index) => index + 1);

  var e = document.getElementById("select") as HTMLSelectElement;

  return (
    <div className="pagination">
      <Pagination>
        <PaginationItem onClick={() => setPage(1)}>
          <PaginationLink first />
        </PaginationItem>
        <PaginationItem onClick={() => page > 1 && setPage(page - 1)}>
          <PaginationLink previous />
        </PaginationItem>

        {arrayPage.map((item) => (
          <PaginationItem
            key={item}
            active={item === page}
            onClick={() => setPage(item)}
          >
            <PaginationLink>{item}</PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem onClick={() => page < totalPage && setPage(page + 1)}>
          <PaginationLink next />
        </PaginationItem>
        <PaginationItem onClick={() => setPage(totalPage)}>
          <PaginationLink last />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default PaginatedItems;
