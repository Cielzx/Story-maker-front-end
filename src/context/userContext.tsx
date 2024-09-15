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
import heic2any from "heic2any";
import { updateUserForm } from "@/schemas/user.schema";

interface userProviderProp {
  children: React.ReactNode;
}

export interface userDescription {
  description: string;
}

export interface userData {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  description: string;
  is_admin: boolean;
  favorites: favoriteData[];
  my_stickers: {
    id: string;
    figure_image: string;
    userId: string;
  }[];
  subscription?: Subscription;
}

interface fontData {
  id: string;
  name: string;
  fileUrl: string;
  format: string;
}

interface Subscription {
  id: string;
  next_payment: Date;
  start_date: Date;
  status: string;
  plan: Plan;
}

interface Plan {
  name: string;
  frequency: string;
}

interface userValues {
  user: userData | undefined;
  setUser: Dispatch<SetStateAction<userData | undefined>>;
  getUser: () => void;
  updateUser: (id: string, data: updateUserForm) => void;
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
  fonts: fontData[];
  fetchFonts(): Promise<void>;
  createFont: (File: File, name: string) => Promise<number | undefined>;
  deleteFont: (id: string) => Promise<void>;
}

export const UserContext = createContext<userValues>({} as userValues);

export const UserProvider = ({ children }: userProviderProp) => {
  const [user, setUser] = useState<userData>();
  const [fonts, setFonts] = useState<fontData[]>([]);
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

  async function fetchFonts() {
    try {
      const response = await api.get(`users/fonts`);
      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      const data = await response.data;
      setFonts(data);

      data.forEach(
        (font: {
          id: string;
          name: string;
          fileUrl: string;
          format: string;
        }) => {
          const style = document.createElement("style");
          style.textContent = `@font-face {
          font-family: '${font.name}';
          src: url('https://story-marker-backend.onrender.com${font.fileUrl}');
        }`;
          document.head.appendChild(style);
        }
      );
    } catch (error) {
      console.error("Error fetching fonts:", error);
    }
  }

  const createFont = async (File: File, name: string) => {
    try {
      const supportedFormats = ["font/ttf", "font/otf"];
      if (supportedFormats.includes(File.type)) {
        const fd = new FormData();
        fd.append("file", File);
        fd.append("name", name);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await api.post("users/fonts", fd, config);

        Toast({
          message: "Fonte adicionada",
          isSucess: true,
        });

        fetchFonts();

        return response.status;
      }
    } catch (error) {
      console.error("Erro ao adicionar fonte:", error);

      Toast({
        message: "Erro ao adicionar fonte",
        isSucess: false,
      });
    }
  };

  const deleteFont = async (id: string) => {
    try {
      await api.delete(`users/fonts/${id}`);

      Toast({
        message: "Fonte deletada",
        isSucess: false,
      });

      fetchFonts();
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (id: string, data: updateUserForm) => {
    try {
      const response = await api.patch(`users/update/${id}`, data);
      Toast({
        message: "Atualizado com sucesso!",
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

  const uploadPhoto = async (userId: string, profileImage: File) => {
    const supportedFormats = [
      "image/heif",
      "image/heic",
      "image/jpg",
      "image/jpeg",
      "image/png",
    ];
    const fileExtension = profileImage.name.split(".").pop()!.toLowerCase();

    try {
      if (supportedFormats.includes(profileImage.type)) {
        const fd = new FormData();
        fd.append("profile_image", profileImage);

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
        fonts,
        fetchFonts,
        createFont,
        deleteFont,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
