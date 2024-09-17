"use client";
import { Heart, Home, Search, Share, UploadIcon, User } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import DropDown from "../components/DropDown/dropdownUser";
import { useCategory, useSticker, useUSer } from "@/hooks";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ReusableList from "./components/Lists/ReusableList";
import DashMenu from "./components/dashMenu";
import KonvaSVGExample from "./components/StickerCreation";
import RecentList from "./components/RecentStickerList";

const DashBoard = () => {
  const { user, getUser } = useUSer();
  const { getSticker, sticker } = useSticker();
  const { categoryArray, getCategory, subCategories, deleteCategory } =
    useCategory();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCategory();
    getUser();
    getSticker();
  }, []);

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
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex flex-col relative flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col absolute">
          <div className="w-full  p-2 h-full  flex flex-col justify-center items-center">
            <div className="w-full flex gap-2 items-center justify-between ">
              <p
                className=""
                style={{
                  fontSize: "clamp(1.3rem, 1vw + 1rem, 1rem)",
                }}
              >
                Seja bem-vinda, {capitalizeFirstLetter(user.name)}
              </p>

              <DropDown />
            </div>

            <div className="w-[70%] min-[940px]:w-[50%] min-[940px]:right-[25%] max-[940px]:right-[15%] flex flex-row-reverse items-center  relative top-[6%] gap-1  p-1 bg-white rounded-md">
              <input
                type="text"
                value={search}
                placeholder="Pesquisar..."
                className="text-black outline-none w-[97%]"
                onChange={(e) => setSearch(e.target.value)}
                id="text"
              />
              <Search color="purple" />
            </div>
          </div>
          <div className="w-full h-[130px] min-[940px]:h-[150px] flex flex-col p-2 overflow-x-auto">
            <h3>Recentes</h3>
            <RecentList stickers={sticker!} />
          </div>
          <div className="flex flex-col w-full h-[60vh] min-[940px]:h-[60vh] justify-center items-center">
            <ReusableList items={categoryArray} search={search} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashBoard;
