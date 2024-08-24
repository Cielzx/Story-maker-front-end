"use client";
import Toast from "@/app/components/Toast";
import { CombineCategorySchema } from "@/schemas/category.schema";
import api from "@/services/api";
import { usePathname } from "next/navigation";
import { parseCookies } from "nookies";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { iSticker } from "./stickerContext";
import { useUSer } from "@/hooks";

interface categoryProp {
  children: React.ReactNode;
}

export interface iSubCategories {
  id: string;
  item_name: string;
  category_name: string;
  cover_image?: string;
  categoryId: string;
  categories: iSubCategories[];
  stickers: iSticker[];
}

interface iCategoryData {
  id: string;
  categories?: iSubCategories[];
  category_name: string;
  cover_image?: string | undefined;
}

interface categoryValues {
  setCoverImage: React.Dispatch<React.SetStateAction<File | null>>;
  createCategory: (data: iCategoryData) => void;
  updateCategory: (data: iCategoryData, id: string) => void;
  createSubCategorie: (data: iSubCategories) => void;
  updateCategories: (data: iSubCategories, id: string) => void;
  deleteCategory: (id: string) => void;
  deleteSubCategory: (id: string) => void;
  getCategory: (id?: string) => void;
  getSubCategorie: (id: string) => void;
  getCategoryById: (id: string) => void;
  subCategorie: iSubCategories | undefined;
  categoryArray: CombineCategorySchema[];
  subCategories: iSubCategories[];
  category: iCategoryData | undefined;
  coverImage: File | null;
  updatedItems: any[];
  setUpdatedItems: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CategoryContext = createContext<categoryValues>(
  {} as categoryValues
);

export const CategoryProvider = ({ children }: categoryProp) => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [categoryArray, setCategoryArray] = useState<CombineCategorySchema[]>(
    []
  );
  const [category, setCategory] = useState<iCategoryData>();
  const [categoryId, setCategoryId] = useState("");
  const [subCategorie, setSubCategorie] = useState<iSubCategories>();
  const [subCategories, setSubcategories] = useState<iSubCategories[]>([]);
  const [updatedItems, setUpdatedItems] = useState(categoryArray);
  const { setMode } = useUSer();
  const cookies = parseCookies();
  const pathname = usePathname();

  if (cookies["user.Token"]) {
    api.defaults.headers.common.authorization = `Bearer ${cookies["user.Token"]}`;
  }

  const uploadFile = async (categoryId: string, coverImage: File) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const fd = new FormData();
      const supportedFormats = [
        "image/heif",
        "image/heic",
        "image/jpg",
        "image/jpeg",
        "image/png",
      ];
      if (supportedFormats.includes(coverImage?.type)) {
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

  const uploadSubFile = async (categorieId: string, coverImage: File) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const fd = new FormData();

      const supportedFormats = [
        "image/heif",
        "image/heic",
        "image/jpg",
        "image/jpeg",
        "image/png",
      ];
      if (supportedFormats.includes(coverImage?.type)) {
        fd.append("cover_image", coverImage);
        const res = await api.patch(
          `categories/upload/${categorieId}`,
          fd,
          config
        );
        return res.status;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createCategory = async (data: iCategoryData) => {
    try {
      const response = await api.post<iCategoryData>("category", data);
      await uploadFile(response.data.id, coverImage!);

      Toast({
        message: "Categoria criada com sucesso",
        isSucess: true,
      });
      getCategory();
    } catch (error) {
      Toast({
        message: "Algum erro ocorreu tente novamente",
        isSucess: false,
      });
      console.log(error);
    }
  };

  const updateItem = (updatedItem: iCategoryData) => {
    setCategoryArray((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const updateCategory = async (data: iCategoryData, id: string) => {
    try {
      const response = await api.patch(`category/update/${id}`, data);
      if (data.cover_image) {
        await uploadFile(id, coverImage!);
      }

      updateItem(response.data);

      Toast({
        message: "Atualizado com sucesso :)",
        isSucess: true,
      });

      getCategory();
    } catch (error) {
      console.log(error);
      Toast({
        message: "Algo deu errado :(",
        isSucess: true,
      });
    }
  };

  const getCategory = async (id?: string) => {
    try {
      let url = "category";

      const response = await api.get(url);

      setCategoryArray(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryById = async (id: string) => {
    try {
      const url = `category/${id}`;
      const response = await api.get(url);

      setCategoryId(response.data.id);
      setSubcategories(response.data.categories);
      setCategory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createSubCategorie = async (data: iSubCategories) => {
    try {
      if (!subCategories) {
        return console.log("error");
      }
      const updatedData = {
        ...data,
        categoryId: categoryId,
      };
      const response = await api.post<iSubCategories>(
        "categories",
        updatedData
      );
      await uploadSubFile(response.data.id, coverImage!);

      Toast({
        message: "Categoria criada com sucesso",
        isSucess: true,
      });
      getCategory(categoryId);
    } catch (error) {
      Toast({
        message: "Algum erro ocorreu tente novamente",
        isSucess: false,
      });
      console.log(error);
    }
  };

  const updateCategories = async (data: iSubCategories, id: string) => {
    try {
      const response = await api.patch(`categories/update/${id}`, data);

      await uploadSubFile(id, coverImage!);

      updateItem(response.data);

      Toast({
        message: "Atualizado com sucesso :)",
        isSucess: true,
      });

      getCategory();
    } catch (error) {
      console.log(error);
      Toast({
        message: "Algo deu errado :(",
        isSucess: true,
      });
    }
  };

  const getSubCategorie = async (id: string) => {
    try {
      const response = await api.get(`categories/${id}`);
      setSubCategorie(response.data);
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
  const deleteSubCategory = async (id: string) => {
    try {
      await api.delete(`categories/${id}`);
      Toast({
        message: "Deletado com sucesso!",
        isSucess: true,
      });

      if (!subCategories) {
        return console.log("error");
      }
      getCategory(categoryId);
    } catch (error) {
      Toast({
        message: "Algo deu errado ao tentar deletar sua musica!",
        isSucess: false,
      });
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        setCoverImage,
        createCategory,
        updateCategory,
        createSubCategorie,
        updateCategories,
        subCategories,
        getCategory,
        getSubCategorie,
        getCategoryById,
        categoryArray,
        category,
        subCategorie,
        deleteCategory,
        deleteSubCategory,
        coverImage,
        updatedItems,
        setUpdatedItems,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
