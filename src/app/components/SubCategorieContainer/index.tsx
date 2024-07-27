"use client";
import ReusableList from "@/app/dashboard/components/Lists/ReusableList";
import { useCategory, useUSer } from "@/hooks";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import CategoryModal from "@/app/dashboard/components/categoryModal";
import FavoriteModal from "@/app/dashboard/components/favoriteModal";

interface props {
  id?: string;
  subId?: string;
}

const SubCategorieContainer = ({ id, subId }: props) => {
  const { subCategories, subCategorie, getSubCategorie, category } =
    useCategory();

  const [isLoading, setIsLoading] = useState(true);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { mode, setMode } = useUSer();

  const pathname = usePathname();

  useEffect(() => {
    if (category || subCategories || subCategorie) {
      setIsLoading(false);
    }
  }, [category, subCategories, subCategorie]);

  if (isLoading) {
    return <Loading />;
  }

  let url = "";

  if (mode === "subCategory") {
    url = "/dashboard";
  }

  if (mode === "sticker") {
    url = `/dashboard/${subCategorie!.categoryId}`;
  }

  let title = "";

  if (mode === "subCategory") {
    title = `${category!.category_name}`;
  } else if (mode === "sticker") {
    title = `${subCategorie!.item_name}`;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[120px] flex justify-center relative items-center border-red-500 border-1 border-solid">
        <Link className="absolute left-[6%]" href={url}>
          <ArrowLeft size={40} />{" "}
        </Link>

        <h2 className="text-white absolute text-4xl">{title}</h2>

        {mode === "sticker" ? (
          <button
            onClick={() => {
              onOpen();
            }}
            className="btn-form flex justify-center w-[20%] absolute right-[2%]"
          >
            favoritos
          </button>
        ) : (
          <></>
        )}
      </div>

      <div className="flex w-full h-full justify-center items-center">
        {pathname.startsWith("/dashboard/") &&
        pathname.split("/").length === 4 ? (
          <ReusableList items={subCategorie!.stickers} id={id} subId={subId} />
        ) : (
          <ReusableList items={subCategories} id={id} subId={subId} />
        )}
      </div>

      <FavoriteModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default SubCategorieContainer;
