import React, { useState, useContext, useEffect } from "react";
import * as S from "./styles";
import Logo from "../../Img/Book.png";
import { Link, useNavigate } from "react-router-dom";
import AuthContext, { AuthType } from "../../Contexts/authContext";
import AuthsService from "../../Services/auths.service";
import toast, { Toaster } from "react-hot-toast";

const SignUp: React.FC = () => {
  const { setUserData, userData, isSignupFail, setIsSignupFail } = useContext(
    AuthContext
  ) as AuthType;
  const navigate = useNavigate();
  useEffect(() => {
    if (userData?.email) {
      navigate("/");
    }
  }, [isSignupFail]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignUp() {
    AuthsService.register(email, password).then(
      (data) => {
        setIsSignupFail(false);
        setPassword("");
        toast.success("Sign Up success. Please login now!");
      },
      (error) => {
        if (error.message) {
          setIsSignupFail(true);
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
        <S.Subtitle>Please, insert your informations to register.</S.Subtitle>
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
        {isSignupFail ? (
          <span className="text-danger mt-1">
            Sign up Failed. Please try again
          </span>
        ) : null}
        <S.SignIn onClick={handleSignUp}>Sign Up</S.SignIn>
        <S.Subtitle>
          Login? <Link to="/login">Login</Link>
        </S.Subtitle>
      </S.RightSide>
      <Toaster position="top-right" />
    </S.Page>
  );
};

export default SignUp;
