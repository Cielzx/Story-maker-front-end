"use client";
import { useCategory, useUSer } from "@/hooks";
import Loading from "@/app/components/Loading";
import SubCategorieContainer from "@/app/components/SubCategorieContainer";
import { useEffect } from "react";

const SubCategoriePage = ({ params }: { params: { id: string } }) => {
  const { user, getUser } = useUSer();
  const { getCategory, getSubCategorie, subCategorie } = useCategory();

  useEffect(() => {
    getCategory(params.id);
    getSubCategorie(params.id);
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
