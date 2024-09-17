"use client";
import ReusableList from "@/app/dashboard/components/Lists/ReusableList";
import { useCategory, useUSer } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { ArrowLeft, Search } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";

interface props {
  id?: string;
  subId?: string;
}

const SubCategorieContainer = ({ id, subId }: props) => {
  const { subCategories, subCategorie, getSubCategorie, category } =
    useCategory();
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");

  const { mode, setMode, user } = useUSer();

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (category || subCategories || subCategorie) {
      setIsLoading(false);
    }
  }, [category, subCategories, subCategorie, user]);

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
    <>
      <div className="w-full flex items-center relative right-[0%] z-10 gap-2 bg-black justify-center text-3xl text-center h-[100px]">
        <button
          onClick={() => {
            router.back();
          }}
          className="absolute left-[2%]"
        >
          <ArrowLeft size={40} />
        </button>

        <div className="w-[75%] h-full text-center flex items-center justify-center">
          <h2
            className="text-white"
            style={{
              fontSize: "clamp(1.5rem, 1vw + 1rem, 1rem)",
            }}
          >
            {title || ""}
          </h2>
        </div>
      </div>
      <div className="flex flex-col w-full h-[72vh] min-[940px]:h-[79vh]  justify-center items-center">
        {pathname.startsWith("/dashboard/") &&
        pathname.split("/").length === 4 ? (
          <ReusableList items={subCategorie!.stickers} id={id} subId={subId} />
        ) : (
          <>
            <div className="w-[70%] min-[940px]:w-[50%] min-[940px]:right-[22%] max-[940px]:right-[11%] flex flex-row-reverse items-center  relative top-[1%]  gap-1  p-1 bg-white z-10 rounded-md">
              <input
                type="text"
                value={search}
                placeholder="Pesquisar..."
                className="text-black outline-none w-[97%] z-[5px]"
                onChange={(e) => setSearch(e.target.value)}
                id="text"
              />
              <Search color="purple" />
            </div>
            <ReusableList
              items={subCategories}
              id={id}
              subId={subId}
              search={search}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SubCategorieContainer;
