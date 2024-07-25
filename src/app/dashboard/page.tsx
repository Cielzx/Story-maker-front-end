"use client";
import { Heart, Home, Search, Share, UploadIcon, User } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import DropDown from "../components/DropDown/dropdownUser";
import { useCategory, useUSer } from "@/hooks";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ReusableList from "./components/Lists/ReusableList";

const DashBoard = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const pathname = usePathname();
  const { user, getUser } = useUSer();
  const { category, getCategory, subCategories, deleteCategory } =
    useCategory();

  useEffect(() => {
    getCategory();
  }, [user]);

  console.log(category);
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
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="backgroundDash "></div>
      <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col h-[100vh]">
          <div className="w-full  p-6  h-[20%] flex flex-col justify-center items-center">
            <div className="w-full flex gap-2 items-center justify-between ">
              <p className="text-[30px]">
                Olá, {capitalizeFirstLetter(user.name)}
              </p>

              <DropDown />
            </div>

            <div className="w-[70%] flex justify-end relative top-[6%] right-[15%] p-1 bg-white rounded-md">
              <Search color="purple" />
            </div>
          </div>
          <div className="flex w-full  justify-center items-center">
            <ReusableList items={category} />
          </div>
        </section>

        {/* <div className="w-full p-2  h-[46px]  bottom-[0%] z-[99999] flex justify-center bg-black rounded-md  p-2">
          <div className="flex gap-2 w-[80%] justify-between">
            <Home size={30} />

            <Heart size={30} />

            <UploadIcon onClick={() => onOpen()} size={30} />

            <User size={30} />
          </div>
        </div>

        <CategoryModal isOpen={isOpen} onClose={onClose} /> */}
      </main>
    </div>
  );
};

export default DashBoard;
