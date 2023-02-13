import React, { useState, createContext } from "react";
import { ChildrenProps } from "./deleteContext";

export interface UserDataProps {
  email: string;
}

export type AuthType = {
  userData: UserDataProps;
  setUserData: Function;
  isLoginFail: Boolean;
  setIsLoginFail: Function;
  isSignupFail: Boolean;
  setIsSignupFail: Function;
};

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const email = localStorage.getItem("@Project:email");
    return { email: email || "" };
  });
  const [isLoginFail, setIsLoginFail] = useState(false);
  const [isSignupFail, setIsSignupFail] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isLoginFail,
        setIsLoginFail,
        isSignupFail,
        setIsSignupFail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
