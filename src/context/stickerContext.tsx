"use client";
import Toast from "@/app/components/Toast";
import { useCategory, useUSer } from "@/hooks";
import api from "@/services/api";
import convertBase64ToBlob from "@/services/image.service";
import { usePathname } from "next/navigation";
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

export interface iSticker {
  id: string;
  figure_name: string;
  subCategoryId: string;
  figure_image?: string;
}

interface stickerValues {
  sticker: iSticker | undefined;
  getSticker: (id?: string) => void;
  setFigureImage: React.Dispatch<React.SetStateAction<File | null>>;
  createSticker: (data: iSticker) => void;
  deleteSticker: (id: string) => void;
  deleteFavorite: (id: string) => void;
  createFavorite: (userId: string, stickerId?: string) => void;
  copyImageToClipboard: (imageSrc: string) => void;
}

export const StickerContext = createContext<stickerValues>({} as stickerValues);

export const StickerProvider = ({ children }: categoryProp) => {
  const [sticker, setSticker] = useState<iSticker>();
  const [figureImage, setFigureImage] = useState<File | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const cookies = parseCookies();
  const pathname = usePathname();

  const { subCategories, subCategorie, getCategory, getSubCategorie } =
    useCategory();

  const { getUser } = useUSer();

  const pathWithoutLeadingSlash = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;
  const pathParts = pathWithoutLeadingSlash.split("/");

  const categoryId = pathParts[1];
  const subCategoryId = pathParts[2];

  if (cookies["user.Token"]) {
    api.defaults.headers.common.authorization = `Bearer ${cookies["user.Token"]}`;
  }

  const uploadStickerFile = async (stickerId: string, figureImage: File) => {
    try {
      console.log(figureImage);
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const fd = new FormData();
      if (figureImage.name.includes("jpg")) {
        Toast({
          message: "Formato não suportado, use o formato PNG",
          isSucess: false,
        });
      }

      if (figureImage?.name.includes("png")) {
        fd.append("figure_image", figureImage);
        const res = await api.patch(`stickers/upload/${stickerId}`, fd, config);
        return res.status;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createSticker = async (data: iSticker) => {
    try {
      const updatedData = {
        ...data,
        subCategoryId: subCategoryId,
      };

      // if (figureImage!.name.includes("jpg")) {
      //   return Toast({
      //     message: "Formato de imagem não suportado, use o formato PNG",
      //     isSucess: false,
      //   });
      // }

      if (
        figureImage!.name.includes("png") ||
        figureImage!.name.includes("heif")
      ) {
        const response = await api.post<iSticker>("stickers", updatedData);
        await uploadStickerFile(response.data.id, figureImage!);

        Toast({
          message: "Figurinha criada com sucesso",
          isSucess: true,
        });
        getSubCategorie(subCategoryId);
      }
    } catch (error) {
      console.log(error);
      Toast({
        message: "Ops! algo deu errado :(",
        isSucess: false,
      });
    }
  };

  const deleteSticker = async (id: string) => {
    try {
      await api.delete(`stickers/${id}`);
      Toast({
        message: "Deletado com sucesso!",
        isSucess: true,
      });

      if (!subCategories) {
        return console.log("error");
      }
      getSubCategorie(subCategoryId);
    } catch (error) {
      Toast({
        message: "Algo deu errado ao tentar deletar sua musica!",
        isSucess: false,
      });
    }
  };

  const getSticker = async (id?: string) => {
    try {
      let url = "stickers";

      if (id) {
        url = `stickers/${id}`;
      }

      const response = await api.get(url);

      setSticker(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createFavorite = async (userId: string, stickerId?: string) => {
    try {
      const updatedData = {
        userId: userId,
        stickerId: stickerId,
      };
      const response = await api.post("favorites", updatedData);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const getFavorite = async () => {
    try {
      const response = await api.get("stickers");
      console.log(response.data);
      getSubCategorie(subCategoryId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      await api.delete(`favorites/${id}`);
      getUser();
    } catch (error) {
      Toast({
        message: "Algo deu errado ao tentar deletar sua musica!",
        isSucess: false,
      });
    }
  };

  const ImageToClipboard = async (imgSrc: string) => {
    try {
      const base64 = imgSrc;
      const blob = convertBase64ToBlob(base64);

      if (isIos()) {
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        Toast({
          message: "Figurinha copiada.",
          isSucess: true,
        });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        Toast({
          message: "Figurinha copiada.",
          isSucess: true,
        });
      }
    } catch (error) {
      console.error("Erro ao copiar a figurinha:", error);
      Toast({
        message: "Erro ao copiar figurinha",
        isSucess: false,
      });
    }
  };

  const isIos = (): boolean => {
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    console.log("User agent:", navigator.userAgent);
    console.log("Is iOS:", isIosDevice);
    return isIosDevice;
  };

  const copyImageToClipboard = async (imageSrc: string) => {
    setShowSpinner(true);
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      if (isIos()) {
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        Toast({
          message: "Figurinha copiada.",
          isSucess: true,
        });
      } else {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        Toast({
          message: "Figurinha copiada :)",
          isSucess: true,
        });
      }
    } catch (error) {
      console.error("Falha ao copiar imagem:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    getSubCategorie(subCategoryId);
  }, []);

  return (
    <StickerContext.Provider
      value={{
        sticker,
        setFigureImage,
        createSticker,
        createFavorite,
        getSticker,
        deleteFavorite,
        deleteSticker,
        copyImageToClipboard,
      }}
    >
      {children}
    </StickerContext.Provider>
  );
};
