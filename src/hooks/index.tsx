import { AuthContext } from "@/context/authContext";
import { CategoryContext } from "@/context/categoryContext";
import { StickerContext } from "@/context/stickerContext";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";

export const useAuth = () => {
  const authcontext = useContext(AuthContext);
  return authcontext;
};

export const useUSer = () => {
  const userContext = useContext(UserContext);
  return userContext;
};

export const useCategory = () => {
  const categoryContext = useContext(CategoryContext);
  return categoryContext;
};

export const useSticker = () => {
  const stickerContext = useContext(StickerContext);
  return stickerContext;
};
