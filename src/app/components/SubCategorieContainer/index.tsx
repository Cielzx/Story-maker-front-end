"use client";
import ReusableList from "@/app/dashboard/components/Lists/ReusableList";
import { useCategory, useUSer } from "@/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface props {
  id?: string;
  subId?: string;
}

const SubCategorieContainer = ({ id, subId }: props) => {
  const { category, getCategory, subCategories, subCategorie } = useCategory();

  const { mode, setMode } = useUSer();

  const pathname = usePathname();

  if (!subCategories || !subCategorie) {
    return <Loading />;
  }

  let url = "";

  if (mode === "subCategory") {
    url = "/dashboard";
  }

  if (mode === "sticker") {
    url = `/dashboard/${subCategorie.categoryId}`;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[120px] flex justify-center relative items-center border-red-500 border-1 border-solid">
        <Link className="absolute left-[6%]" href={url}>
          <ArrowLeft size={40} />{" "}
        </Link>

        <h2 className="text-white absolute text-4xl">TESTE</h2>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        {pathname.startsWith("/dashboard/") &&
        pathname.split("/").length === 4 ? (
          <ReusableList items={subCategorie.stickers} id={id} subId={subId} />
        ) : (
          <ReusableList items={subCategories} id={id} subId={subId} />
        )}
      </div>
    </div>
  );
};

export default SubCategorieContainer;
