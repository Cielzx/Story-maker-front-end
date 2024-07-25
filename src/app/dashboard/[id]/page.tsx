"use client";
import { useCategory, useUSer } from "@/hooks";
import Loading from "@/app/components/Loading";
import SubCategorieContainer from "@/app/components/SubCategorieContainer";
import { useEffect } from "react";

const SubCategoriePage = ({ params }: { params: { id: string } }) => {
  const { user, getUser } = useUSer();
  const { category, getCategory, subCategories } = useCategory();
  useEffect(() => {
    getCategory(params.id);
  }, [params.id]);

  if (!user) {
    return <Loading />;
  }
  return (
    <>
      <SubCategorieContainer id={params.id} />
    </>
  );
};

export default SubCategoriePage;
