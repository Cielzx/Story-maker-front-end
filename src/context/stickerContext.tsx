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
import { useCopyToClipboard } from "react-use";

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
  createSticker: (imgMode?: string, file?: File) => void;
  createUserSticker: (imgMode?: string, file?: File) => Promise<void>;
  deleteSticker: (id: string, userId?: string) => void;
  deleteFavorite: (id: string) => void;
  createFavorite: (userId: string, stickerId?: string) => void;
  uploadStickerFile: (
    stickerId?: string,
    figureImage?: File,
    imgMode?: string
  ) => Promise<number | undefined>;
  writeImageToClipboard(
    url: string,
    color: string,
    opacity: number
  ): Promise<Blob>;
  createIcon: (file?: File) => Promise<void>;
  deleteIcon: (id: string) => Promise<void>;
  getIcons: () => Promise<void>;
  icons: iIcon[] | undefined;
}

interface iIcon {
  id: string;
  icon_image: string;
}

export const StickerContext = createContext<stickerValues>({} as stickerValues);

export const StickerProvider = ({ children }: categoryProp) => {
  const [sticker, setSticker] = useState<iSticker>();
  const [icons, setIcons] = useState<iIcon[]>();
  const [figureImage, setFigureImage] = useState<File | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const cookies = parseCookies();
  const pathname = usePathname();

  const { subCategories, subCategorie, getCategory, getSubCategorie } =
    useCategory();

  const { getUser, user } = useUSer();

  const pathWithoutLeadingSlash = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;
  const pathParts = pathWithoutLeadingSlash.split("/");

  const categoryId = pathParts[1];
  const subCategoryId = pathParts[2];

  if (cookies["user.Token"]) {
    api.defaults.headers.common.authorization = `Bearer ${cookies["user.Token"]}`;
  }

  const uploadStickerFile = async (
    stickerId?: string,
    figureImage?: File,
    imgMode?: string
  ) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const fd = new FormData();
      if (figureImage?.name.includes("jpg")) {
        Toast({
          message: "Formato não suportado, use o formato PNG",
          isSucess: false,
        });
      }

      let url = `stickers/upload-to-svg/${stickerId}`;

      if (imgMode === "png") {
        url = `stickers/upload-to-png/${stickerId}`;
      }

      if (figureImage?.name.includes("png")) {
        fd.append("figure_image", figureImage);
        const res = await api.patch(url, fd, config);
        return res.status;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createSticker = async (imgMode?: string, file?: File) => {
    try {
      const updatedData = {
        subCategoryId: subCategoryId,
      };

      if (figureImage?.name.includes("jpg")) {
        Toast({
          message: "Formato não suportado, use o formato PNG",
          isSucess: false,
        });
      } else {
        const response = await api.post<iSticker>("stickers", updatedData);
        await uploadStickerFile(response.data.id, file!, imgMode);

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

  const deleteIcon = async (id: string) => {
    try {
      await api.delete(`stickers/icon/${id}`);
      Toast({
        message: "Deletado com sucesso!",
        isSucess: true,
      });

      getIcons();
    } catch (error) {
      Toast({
        message: "Algo deu errado!",
        isSucess: false,
      });
    }
  };

  const iconUpload = async (iconId: string, iconImage: File) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const fd = new FormData();
      if (iconImage?.name.includes("jpg")) {
        Toast({
          message: "Formato não suportado, use o formato PNG",
          isSucess: false,
        });
      }

      if (iconImage?.name.includes("png")) {
        fd.append("icon_image", iconImage);
        const res = await api.patch(`stickers/icon/${iconId}`, fd, config);
        return res.status;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getIcons = async () => {
    try {
      const response = await api.get("stickers/icons");
      setIcons(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createIcon = async (file?: File) => {
    try {
      if (file?.name.includes("jpg")) {
        Toast({
          message: "Formato não suportado, use o formato PNG",
          isSucess: false,
        });
      } else {
        const response = await api.post(`stickers/icon`);
        await iconUpload(response.data.id, file!);

        Toast({
          message: "Icon adicionado com sucesso",
          isSucess: true,
        });
        getIcons();
      }
    } catch (error) {}
  };

  const createUserSticker = async (imgMode?: string, file?: File) => {
    try {
      const updatedData = {
        subCategoryId: null,
      };

      if (file?.name.includes("jpg")) {
        Toast({
          message: "Formato não suportado, use o formato PNG",
          isSucess: false,
        });
      } else {
        const response = await api.post<iSticker>(
          `stickers/user-sticker/${user!.id}`,
          updatedData
        );
        await uploadStickerFile(response.data.id, file!, imgMode);

        Toast({
          message: "Figurinha criada com sucesso",
          isSucess: true,
        });
        getUser();
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

  const deleteSticker = async (id: string, userId?: string) => {
    try {
      let url = `stickers/${id}`;
      if (userId) {
        url = `stickers/${userId}/${id}}`;
      }

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
        message: "Algo deu errado!",
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

  const deleteFavorite = async (id: string) => {
    try {
      await api.delete(`favorites/${id}`);
      getUser();
    } catch (error) {
      Toast({
        message: "Algo deu errado!",
        isSucess: false,
      });
    }
  };

  async function writeImageToClipboard(
    url: string,
    color: string,
    opacity: number
  ) {
    const response = await fetch(url);
    const blob = await response.blob();

    if (!response.ok) {
      throw new Error("Falha ao buscar a imagem");
    }

    if (url.endsWith("png")) {
      return blob;
    }

    const img = new Image();
    const svgText = await blob.text();

    const coloredSvgText = svgText
      .replace(/fill="[^"]*"/g, "")
      .replace(/<svg([^>]+)>/, `<svg$1 fill="${color}">`)
      .replace(/<svg([^>]+)>/, `<svg$1 opacity="${opacity}">`);
    const svgBlob = new Blob([coloredSvgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
    const loadImage = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        img.src = svgUrl;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    const loadedImg = await loadImage();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = loadedImg.width;
    canvas.height = loadedImg.height;

    ctx?.drawImage(loadedImg, 0, 0);

    const writeItem = async () => {
      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, "image/png");
      });
    };

    const svg = await writeItem();

    URL.revokeObjectURL(svgUrl);
    return svg;
  }

  return (
    <StickerContext.Provider
      value={{
        sticker,
        setFigureImage,
        createSticker,
        createUserSticker,
        createFavorite,
        uploadStickerFile,
        getSticker,
        deleteFavorite,
        deleteSticker,
        writeImageToClipboard,
        createIcon,
        getIcons,
        icons,
        deleteIcon,
      }}
    >
      {children}
    </StickerContext.Provider>
  );
};
