import React, { useState, createContext, ReactNode } from "react";
import { DeleteType } from "./deleteType";

export interface ChildrenProps {
  children: React.ReactNode;
}

export const DeleteContext = createContext<DeleteType | null>(null);

export const DeleteContextProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [id, setId] = useState("");

  return (
    <DeleteContext.Provider value={{ showDelete, setShowDelete, id, setId }}>
      {children}
    </DeleteContext.Provider>
  );
};
