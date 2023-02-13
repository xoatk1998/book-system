import axios from "axios";

const API_URL = "http://127.0.0.1:3004/auth/";

class AuthsService {
  login(email: string, password: string) {
    return axios
      .post(API_URL + "login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {}

  register(email: string, password: string) {
    return axios.post(API_URL + "register", {
      email,
      password,
      name: email.split("@")[0],
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthsService();
