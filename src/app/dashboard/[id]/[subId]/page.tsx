"use client";
import { useCategory, useSticker, useUSer } from "@/hooks";
import Loading from "@/app/components/Loading";
import SubCategorieContainer from "@/app/components/SubCategorieContainer";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const StickerPage = ({ params }: { params: { subId: string } }) => {
  const { user, getUser } = useUSer();
  const { getSubCategorie, subCategorie, getCategoryById } = useCategory();

  const pathname = usePathname();
  const pathWithoutLeadingSlash = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;
  const pathParts = pathWithoutLeadingSlash.split("/");

  const categoryId = pathParts[1];
  const subCategoryId = pathParts[2];

  useEffect(() => {
    getCategoryById(categoryId);
    getSubCategorie(subCategoryId);
  }, [subCategorie]);

  if (!user) {
    return <Loading />;
  }
  return <SubCategorieContainer subId={params.subId} />;
};

export default StickerPage;
