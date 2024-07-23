"use client";
import Toast from "@/app/components/Toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface categoryProp {
  children: React.ReactNode;
}

interface categoryData {
  id: string;
  category_name: string;
  cover_image: string | undefined;
}

interface categoryValues {
  setCoverImage: React.Dispatch<React.SetStateAction<File | null>>;
  createCategory: (data: categoryData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategory: () => Promise<void>;
  category: categoryData[];
}

export const CategoryContext = createContext<categoryValues>(
  {} as categoryValues
);

export const CategoryProvider = ({ children }: categoryProp) => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [category, setCategory] = useState<categoryData[]>([]);
  const cookies = parseCookies();

  if (cookies["user.Token"]) {
    api.defaults.headers.common.authorization = `Bearer ${cookies["user.Token"]}`;
  }

  const uploadFile = async (categoryId: string, coverImage: File) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const fd = new FormData();
      if (coverImage?.name.includes("jpg")) {
        fd.append("cover_image", coverImage);
        const res = await api.patch(
          `category/upload/${categoryId}`,
          fd,
          config
        );
        return res.status;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createCategory = async (data: categoryData) => {
    try {
      const response = await api.post<categoryData>("category", data);
      await uploadFile(response.data.id, coverImage!);

      Toast({
        message: "Categoria criada com sucess",
        isSucess: true,
      });
    } catch (error) {
      Toast({
        message: "Algum erro ocorreu tente novamente",
        isSucess: false,
      });
      console.log(error);
    }
  };

  const getCategory = async () => {
    try {
      const response = await api.get("category");
      setCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`category/${id}`);
      Toast({
        message: "Deletado com sucesso!",
        isSucess: true,
      });
      getCategory();
    } catch (error) {
      Toast({
        message: "Algo deu errado ao tentar deletar sua musica!",
        isSucess: false,
      });
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        setCoverImage,
        createCategory,
        getCategory,
        category,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
