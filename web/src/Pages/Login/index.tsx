import React, { useState, useContext, useEffect } from "react";
import * as S from "./styles";
import Logo from "../../Img/Book.png";
import { Link, useNavigate } from "react-router-dom";
import AuthContext, { AuthType } from "../../Contexts/authContext";
import AuthsService from "../../Services/auths.service";
import toast, { Toaster } from "react-hot-toast";

const Login: React.FC = () => {
  const { setUserData, userData, isLoginFail, setIsLoginFail } = useContext(
    AuthContext
  ) as AuthType;
  const navigate = useNavigate();
  useEffect(() => {
    if (userData?.email) {
      navigate("/");
    }
  }, [isLoginFail]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    AuthsService.login(email, password).then(
      (data) => {
        localStorage.setItem("accessToken", data.stsTokenManager.accessToken);
        localStorage.setItem("refreshToken", data.stsTokenManager.refreshToken);
        localStorage.setItem("@Project:email", email);
        setUserData({ email });
        window.location.reload();
      },
      (error) => {
        if (error.message) {
          setIsLoginFail(true);
        }
      }
    );
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  return (
    <S.Page>
      <S.LeftSide>
        <S.Img src={Logo}></S.Img>
      </S.LeftSide>
      <S.RightSide>
        <S.Title>Welcome to Book System</S.Title>
        <S.Subtitle>Please, insert your informations to login.</S.Subtitle>
        <S.FieldName>Email</S.FieldName>
        <S.InputField
          value={email}
          id="email"
          onChange={handleEmail}
          placeholder="Insert your email"
        ></S.InputField>
        <S.FieldName>Password</S.FieldName>
        <S.InputField
          placeholder="Insert your password"
          id="password"
          onChange={handlePassword}
          type="password"
        ></S.InputField>
        {isLoginFail ? (
          <span className="text-danger mt-1">
            Login Failed. Please try again
          </span>
        ) : null}
        {/* <S.KeepSigned><S.Checkbox/><S.Subtitle>Remember me</S.Subtitle></S.KeepSigned> */}
        <S.SignIn onClick={handleLogin}>Sign In</S.SignIn>
        <S.Subtitle>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </S.Subtitle>
        <Toaster position="top-right" />
      </S.RightSide>
    </S.Page>
  );
};

export default Login;
