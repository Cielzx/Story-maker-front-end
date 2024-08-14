"use client";
import { useUSer } from "@/hooks";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  CircleUser,
  Edit,
  FilePen,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import UserEditForm from "./Components/UserEditForm";
import InfoPlan from "./Components/PlanInfo";

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
          <div className="w-full  h-full bg-white  flex flex-col fixed justify-center items-center">
            <div
              className="w-[100%] h-[55%] flex justify-center"
              style={{
                backgroundImage: `url(https://images2.imgbox.com/4f/49/NfAbt61z_o.jpg)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderBottomLeftRadius: "50% 20%",
                borderBottomRightRadius: "50% 20%",
              }}
            ></div>

            <div className="w-[60%] max-[940px]:w-full h-[65%] relative flex items-center justify-center">
              <div
                className="w-[50%]  max-lg:w-[70%] h-[100%] max-md:h-[400px] bg-black text-white absolute bottom-[35%] text-black font-semibold rounded-lg flex absolute bottom-[20%] items-center flex-col justify-center gap-1 p-2 relative"
                style={{
                  boxShadow:
                    " rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                }}
              >
                <div className="w-[50%] flex flex-col gap-2 justify-center absolute bottom-[72%] z-10  items-center">
                  <div
                    {...getRootProps()}
                    className="w-36 h-36 bg-white text-4xl group border border-black border-solid relative rounded-full bg-gray-900 max-[920px]:w-32 max-[920px]:h-32"
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
                      <p className="w-full h-full rounded-full bg-rose-600 flex justify-center items-center text-6xl  text-white">
                        {initials}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-3xl font-semibold text-white">
                      {user?.name}
                    </p>
                  </div>
                </div>
                {mode === "info" ||
                mode === "changePassword" ||
                mode === "requestPassword" ? (
                  <>
                    <div className="w-full absolute left-[85%] top-[2%]  z-10 cursor-pointer">
                      <ArrowLeft
                        className=""
                        onClick={() => setMode("profile")}
                        size={30}
                      />
                    </div>
                    <UserEditForm />
                  </>
                ) : mode === "infoPlan" ? (
                  <>
                    <div className="w-full absolute left-[85%] top-[2%]  z-10 cursor-pointer">
                      <ArrowLeft
                        className=""
                        onClick={() => setMode("profile")}
                        size={30}
                      />
                    </div>
                    <InfoPlan />
                  </>
                ) : (
                  <div className="w-[100%] h-[74%] flex items-center flex-col gap-1 justify-end">
                    <div className="w-[80%] flex justify-between gap-1 items-center h-[50px]">
                      <button
                        onClick={() => setMode("info")}
                        className="flex  gap-1"
                      >
                        <Edit /> Editar conta
                      </button>

                      <ChevronRight onClick={() => setMode("info")} size={30} />
                    </div>

                    <div className="w-[80%] flex justify-between gap-1 items-center h-[50px]">
                      <button
                        onClick={() => setMode("changePassword")}
                        className="flex gap-1"
                      >
                        <KeyRound /> Atualizar senha
                      </button>

                      <ChevronRight
                        size={30}
                        onClick={() => setMode("changePassword")}
                      />
                    </div>

                    <div className="w-[80%] flex justify-between gap-1 items-center h-[50px]">
                      <button
                        onClick={() => setMode("infoPlan")}
                        className="w-full flex gap-1 "
                      >
                        <FilePen /> Assinatura
                      </button>

                      <ChevronRight
                        onClick={() => setMode("infoPlan")}
                        size={30}
                      />
                    </div>

                    <div className="w-[80%] flex justify-between gap-1 items-center h-[50px]">
                      <button
                        onClick={() => handleLogout()}
                        className="flex gap-1"
                      >
                        <LogOut /> Sair da conta
                      </button>

                      <ChevronRight size={30} onClick={() => handleLogout()} />
                    </div>
                  </div>
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
