"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";
import api from "@/services/api";
import Toast from "@/app/components/Toast";
import { useAuth } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { favoriteData } from "@/schemas/favorite.schema";

interface userProviderProp {
  children: React.ReactNode;
}

export interface userDescription {
  description: string;
}

interface userData {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  description: string;
  is_admin: boolean;
  favorites: favoriteData[];
}

interface userValues {
  user: userData | undefined;
  setUser: Dispatch<SetStateAction<userData | undefined>>;
  getUser: () => void;
  updateUser: (id: string, data: userData) => void;
  uploadPhoto: (
    userId: string,
    profileImage: File
  ) => Promise<number | undefined>;
  setProfileImage: Dispatch<SetStateAction<File | null>>;
  profileImage: File | null;
  mode: string;
  description: string;
  updateDescription: (data: userDescription) => Promise<void>;
  setMode: Dispatch<SetStateAction<string>>;
}

export const UserContext = createContext<userValues>({} as userValues);

export const UserProvider = ({ children }: userProviderProp) => {
  const [user, setUser] = useState<userData>();
  let [userId, setUserId] = useState("");
  const [mode, setMode] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  let cookies = parseCookies();
  const router = useRouter();
  let pathname = usePathname();

  if (cookies["user.Token"]) {
    api.defaults.headers.common.authorization = `Bearer ${cookies["user.Token"]}`;
  }

  const getUser = async () => {
    try {
      const decodedToken = jwt.decode(cookies["user.Token"]);

      const id = decodedToken ? decodedToken.sub : null;
      const response = await api.get(`users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (id: string, data: userData) => {
    try {
      const response = await api.patch(`users/update/${id}`, data);
      Toast({
        message: "Nome atualizado com sucesso!",
        isSucess: true,
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let decodedToken = jwt.decode(cookies["user.Token"]);
    let id = decodedToken ? decodedToken.sub : null;
    setUserId(id!);
  }, [cookies["user.Token"]]);

  const updateDescription = async (data: userDescription) => {
    try {
      const decodedToken = jwt.decode(cookies["user.Token"]);

      const id = decodedToken ? decodedToken.sub : null;
      const response = await api.patch(`users/${id}`, data);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const convertToSupportedFormat = async (file: File) => {
    if (file.type === "image/heif" || file.type === "image/heic") {
      const heic2any = require("heic2any");
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
      });
      return new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
    }
    return file;
  };

  const uploadPhoto = async (userId: string, profileImage: File) => {
    const supportedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/heif",
      "image/heic",
    ];
    const fileExtension = profileImage.name.split(".").pop()!.toLowerCase();
    // const fileToUpload = await convertToSupportedFormat(profileImage);
    try {
      console.log("Tipo MIME do arquivo:", profileImage.type);
      console.log("Nome do arquivo:", profileImage.name);
      if (supportedFormats.includes(profileImage.type)) {
        const fd = new FormData();
        fd.append("profile_image", profileImage);

        for (const [key, value] of fd.entries()) {
          console.log(`${key}: ${value}`);
        }

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const res = await api.patch(`users/upload/${userId}`, fd, config);

        Toast({
          message: "Foto atualizada",
          isSucess: true,
        });
        console.log("Caminho do arquivo:", res);
        getUser();
        return res.status;
      }
    } catch (error) {
      Toast({
        message: "Erro tente novamente",
        isSucess: false,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [pathname]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUser,
        updateUser,
        uploadPhoto,
        profileImage,
        setProfileImage,
        mode,
        setMode,
        description,
        updateDescription,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
