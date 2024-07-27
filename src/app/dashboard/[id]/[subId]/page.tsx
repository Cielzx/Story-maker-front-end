"use client";
import { useCategory, useSticker, useUSer } from "@/hooks";
import Loading from "@/app/components/Loading";
import SubCategorieContainer from "@/app/components/SubCategorieContainer";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const StickerPage = ({ params }: { params: { subId: string } }) => {
  const { user, getUser } = useUSer();
  const { getCategory, subCategories, getSubCategorie, subCategorie } =
    useCategory();
  const { getSticker, sticker } = useSticker();

  const pathname = usePathname();
  const pathWithoutLeadingSlash = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;
  const pathParts = pathWithoutLeadingSlash.split("/");

  const categoryId = pathParts[1];
  const subCategoryId = pathParts[2];

  useEffect(() => {
    getCategory(categoryId);
    getSubCategorie(subCategoryId);
    getSticker(subCategoryId);
  }, [params.subId]);

  if (!user) {
    return <Loading />;
  }
  return (
    <>
      <SubCategorieContainer subId={params.subId} />
    </>
  );
};

export default StickerPage;
