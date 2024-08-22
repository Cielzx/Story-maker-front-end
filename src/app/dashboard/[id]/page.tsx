"use client";
import { useCategory, useUSer } from "@/hooks";
import Loading from "@/app/components/Loading";
import SubCategorieContainer from "@/app/components/SubCategorieContainer";
import { useEffect, useState } from "react";

const SubCategoriePage = ({ params }: { params: { id: string } }) => {
  const { user, getUser } = useUSer();
  const [isLoading, setIsLoading] = useState(true);
  const {
    getCategory,
    getCategoryById,
    getSubCategorie,
    subCategorie,
    category,
  } = useCategory();

  useEffect(() => {
    if (category) {
      setIsLoading(false);
    }
    getCategoryById(params.id);
    getSubCategorie(params.id);
  }, [params.id, category, user]);

  if (isLoading) {
    return <Loading />;
  }
  return <SubCategorieContainer id={params.id} />;
};

export default SubCategoriePage;
