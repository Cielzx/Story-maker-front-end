"use client";
import Loading from "@/app/components/Loading";
import { useUSer } from "@/hooks";
import { Camera, Edit, KeyRound, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CategoryModal from "../components/categoryModal";
import { useDisclosure } from "@chakra-ui/react";

const Profile = () => {
  const { user, setProfileImage, profileImage, uploadPhoto } = useUSer();

  const onDrop = useCallback((files: File[]) => {
    const selectFiles = files[0];
    setProfileImage(selectFiles);
  }, []);

  useEffect(() => {
    if (profileImage) {
      uploadPhoto(user!.id, profileImage);
    }

    console.log(profileImage);
  }, [profileImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": ["jpg"], "image/png": ["png"] },
  });

  if (!user) {
    return <Loading />;
  }

  let initials = "";
  const names = user.name.split(" ");

  if (names && names.length > 0) {
    const firstName = names[0];
    initials += firstName.charAt(0).toUpperCase();
  }

  if (names && names?.length > 1) {
    const lastName = names[names.length - 1];
    initials += lastName.charAt(0).toUpperCase();
  }

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="backgroundDash"></div>
      <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col relative items-center h-[100vh]">
          <div
            className="w-[100%] h-[40%] flex flex col"
            style={{
              backgroundImage: `url(https://images2.imgbox.com/4f/49/NfAbt61z_o.jpg)`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="w-full flex flex-col gap-4 justify-center items-center">
              <div
                {...getRootProps()}
                className="w-24 h-24 bg-pink-400 text-4xl group relative  rounded-full bg-gray-900 max-[920px]:w-24 max-[920px]:h-24"
              >
                <div className="hidden w-full h-full rounded-full flex items-center justify-center group-hover:flex absolute bg-[rgba(0,0,0,0.3)]">
                  <Camera />
                </div>
                <input className="hidden" {...getInputProps()} />
                {user.profile_image ? (
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
                <p className="text-3xl">{user.name}</p>
              </div>
            </div>
          </div>

          <div className="w-[75%] h-[44%] bg-[rgba(0,0,0,0.2)] rounded-lg flex absolute bottom-[20%] flex-col justify-center gap-4 p-2">
            <div className="w-full flex items-center h-[50px] border-b-[1px] border-solid">
              <button className="flex gap-1">
                <Edit /> Informações
              </button>
            </div>
            <div className="w-full flex items-center h-[50px] border-b-[1px] border-solid">
              <button className="flex gap-1">
                <KeyRound /> Atualizar senha
              </button>
            </div>
            <div className="w-full flex items-center h-[50px] border-b-[1px] border-solid">
              <button className="flex gap-1">
                <LogOut /> Sair da conta
              </button>
            </div>
          </div>
        </section>
        {/* <CategoryModal isOpen={isOpen} onClose={onClose} /> */}
      </main>
    </div>
  );
};

export default Profile;
