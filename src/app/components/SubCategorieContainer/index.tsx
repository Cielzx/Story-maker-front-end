"use client";
import ReusableList from "@/app/dashboard/components/Lists/ReusableList";
import { useCategory, useUSer } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
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

  const router = useRouter();

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
    title = `${category!.category_name || ""}`;
  } else if (mode === "sticker") {
    title = `${subCategorie!.item_name || ""}`;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center z-10 bg-black justify-center text-3xl text-center h-[100px]">
        <button onClick={() => router.back()} className="absolute left-[6%]">
          <ArrowLeft size={40} />{" "}
        </button>

        <h2 className="text-white absolute text-3xl">{title || ""}</h2>
      </div>

      <div className="flex w-full h-full justify-center absolute items-center">
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
