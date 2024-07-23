"use client";
import { Heart, Home, Search, Share, UploadIcon, User } from "lucide-react";
import CategoryList from "./components/categoryList";
import CategoryModal from "./components/categoryModal";
import { useDisclosure } from "@chakra-ui/react";
import DropDown from "../components/DropDown/dropdownUser";

const DashBoard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="backgroundDash "></div>
      <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col h-[100vh]">
          <div className="w-full  p-6  h-full flex flex-col justify-center items-center">
            <div className="w-full flex gap-2 items-center justify-between ">
              <p className="text-[30px]">Olá, Lorena</p>

              {/* <div className="w-[67px] h-[67px] rounded-full">
                <img
                  src="https://cdn.discordapp.com/avatars/1071554623879520359/8f73e6efd2b9dcb9ce898589a264333b.webp?size=80"
                  className="object-cover w-full h-full rounded-full"
                  alt="Foto de perfil do usuario"
                />
              </div> */}
              <DropDown />
            </div>

            <div className="w-[70%] flex justify-end relative top-[6%] right-[15%] p-1 bg-white rounded-md">
              <Search color="purple" />
            </div>
          </div>
          <div className="flex w-full h-full justify-center items-center">
            <CategoryList />
          </div>
        </section>

        <div className="w-full p-2  h-[46px]  bottom-[0%] z-[99999] flex justify-center bg-black rounded-md  p-2">
          <div className="flex gap-2 w-[80%] justify-between">
            <Home size={30} />

            <Heart size={30} />

            <UploadIcon onClick={() => onOpen()} size={30} />

            <User size={30} />
          </div>
        </div>
      </main>

      <CategoryModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default DashBoard;
