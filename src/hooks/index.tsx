import { AuthContext } from "@/context/authContext";
import { CategoryContext } from "@/context/categoryContext";
import { useContext } from "react";

export const useAuth = () => {
  const authcontext = useContext(AuthContext);
  return authcontext;
};

export const useCategory = () => {
  const categoryContext = useContext(CategoryContext);
  return categoryContext;
};
