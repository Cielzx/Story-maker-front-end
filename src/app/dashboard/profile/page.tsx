"use client";
import { useUSer } from "@/hooks";
import { ArrowLeft, Camera, Edit, KeyRound, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import UserEditForm from "./Components/UserEditForm";

interface FileInfo {
  dateModified: string;
  name: string;
  size: number;
  type: string;
}

const Profile = () => {
  const {
    user,
    setProfileImage,
    profileImage,
    uploadPhoto,
    getUser,
    mode,
    setMode,
  } = useUSer();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];

    if (file.type === "image/heif" || file.type === "image/heic") {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: "image/png",
        };

        const compressedFile = await imageCompression(file, options);

        setProfileImage(compressedFile);
      } catch (error) {
        console.error("Erro ao converter a imagem HEIF:", error);
      }
    } else {
      setProfileImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".heif", ".heic"],
    },
  });

  const router = useRouter();
  const handleLogout = () => {
    destroyCookie(null, "user.Token");
    return router.push("/login");
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (profileImage) {
      uploadPhoto(user!.id, profileImage);
    }
  }, [profileImage]);

  let initials = "";
  const names = user?.name.split(" ");

  if (names && names.length > 0) {
    const firstName = names[0];
    initials += firstName.charAt(0).toUpperCase();
  }

  if (names && names?.length > 1) {
    const lastName = names[names.length - 1];
    initials += lastName.charAt(0).toUpperCase();
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="backgroundDash"></div>
      <div className="w-full flex flex-col relative flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col">
          <div className="w-full  h-full  flex flex-col fixed justify-center items-center">
            <div
              className="w-[100%] h-[40%] flex justify-center"
              style={{
                backgroundImage: `url(https://images2.imgbox.com/4f/49/NfAbt61z_o.jpg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="w-[50%] flex flex-col gap-0 justify-center absolute bottom-[63%] z-10  items-center">
                <div
                  {...getRootProps()}
                  className="w-32 h-32 bg-white text-4xl group border border-white border-solid relative rounded-full bg-gray-900 max-[920px]:w-24 max-[920px]:h-24"
                >
                  <div className="hidden w-full h-full rounded-full flex items-center justify-center group-hover:flex absolute bg-[rgba(0,0,0,0.3)]">
                    <Camera />
                  </div>
                  <input className="hidden" {...getInputProps()} />
                  {user && user.profile_image ? (
                    <img
                      src={user.profile_image}
                      className="rounded-full w-full h-full object-cover"
                      alt="Foto de perfil"
                    />
                  ) : (
                    <p className="w-full h-full flex justify-center items-center  text-white">
                      {initials}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-3xl font-semibold text-black">
                    {user?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[60%] max-[940px]:w-full h-[60%] relative flex items-center justify-center">
              <div className="w-[50%]  max-lg:w-[70%] h-[100%] bg-white absolute bottom-[25%] text-black font-semibold rounded-lg flex absolute bottom-[20%] flex-col justify-center gap-4 p-2">
                {mode === "info" || mode === "requestPassword" ? (
                  <>
                    <div className="absolute right-[2%] top-[2%] z-10 cursor-pointer">
                      <ArrowLeft onClick={() => setMode("profile")} size={30} />
                    </div>
                    <UserEditForm />
                  </>
                ) : (
                  <>
                    <div className="w-full flex items-center h-[50px]">
                      <button
                        onClick={() => setMode("info")}
                        className="flex gap-1"
                      >
                        <Edit /> Informações
                      </button>
                    </div>
                    <div className="w-full flex items-center h-[50px]">
                      <button
                        onClick={() => setMode("requestPassword")}
                        className="flex gap-1"
                      >
                        <KeyRound /> Atualizar senha
                      </button>
                    </div>
                    <div className="w-full flex items-center h-[50px]">
                      <button
                        onClick={() => handleLogout()}
                        className="flex gap-1"
                      >
                        <LogOut /> Sair da conta
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
