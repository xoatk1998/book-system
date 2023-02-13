import axios from "axios";
import { BookProps } from "../Contexts/bookType";

const API_URL = "http://127.0.0.1:3004/books";

class BooksService {
  async addBookAPI(book: BookProps) {
    const { id, ...body } = book;
    body.isbn = parseInt(body.isbn) as any;
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "access-token": token,
      },
    };
    return axios.post(`${API_URL}`, body, config);
  }

  async updateBookAPI(book: BookProps) {
    const { id, ...body } = book;
    body.isbn = parseInt(body.isbn) as any;
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "access-token": token,
      },
    };
    return axios.put(`${API_URL}/${id}`, body, config);
  }

  async deleteBookAPI(id: string) {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "access-token": token,
      },
    };
    return axios.delete(`${API_URL}/${id}`, config);
  }
}

export default new BooksService();
