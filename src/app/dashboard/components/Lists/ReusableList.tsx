import { useCategory, useSticker, useUSer } from "@/hooks";
import { CombineCategorySchema } from "@/schemas/category.schema";
import { motion } from "framer-motion";
import { Edit, Frown, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface props {
  items: CombineCategorySchema[];
  id?: string;
  subId?: string;
}

const ReusableList = ({ items, id, subId }: props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { deleteCategory, deleteSubCategory } = useCategory();
  const { deleteSticker } = useSticker();
  const { mode, setMode } = useUSer();

  if (pathname === "/dashboard") {
    setMode("category");
  } else if (
    pathname.startsWith("/dashboard/") &&
    pathname.split("/").length === 3
  ) {
    setMode("subCategory");
  } else if (
    pathname.startsWith("/dashboard/") &&
    pathname.split("/").length === 4
  ) {
    setMode("sticker");
  }

  console.log(mode);
  const handleCategoryName = (id: string) => {
    return router.push(`/dashboard/${id}`);
  };
  const handleToPage = (id: string, subId: string) => {
    return router.push(`/dashboard/${id}/${subId}`);
  };

  const url = pathname.split("/");
  const result = url.slice(2).join("/");

  const handleRedirect = (id?: string, subId?: string) => {
    if (pathname === `/dashboard`) {
      handleCategoryName(id!);
    }
    handleToPage(result, id!);
  };

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <ul className="w-full justify-center flex flex-wrap gap-2 p-3">
      {items && items.length > 0 ? (
        <div className="w-[100%] flex justify-between flex-wrap gap-2 p-2">
          <>
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="w-[48%] "
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5 }}
              >
                <li
                  key={item.id}
                  className="w-full h-[170px] min-[940px]:h-[240px] flex items-start group justify-center relative rounded-lg"
                  style={{
                    backgroundImage: `url(${
                      mode === "sticker" ? item.figure_image : item.cover_image
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="w-full flex hidden group-hover:flex justify-between p-1">
                    <Edit size={20} />
                    <Trash
                      onClick={() => {
                        if (mode === "category") {
                          deleteCategory(item.id);
                        } else if (mode === "subCategory") {
                          deleteSubCategory(item.id);
                        } else if (mode === "sticker") {
                          deleteSticker(item.id);
                        }
                      }}
                      size={20}
                    />
                  </div>

                  <span
                    onClick={() => handleRedirect(item.id)}
                    className="absolute text-[4vw]  font-semibold font-nixie bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer"
                  >
                    {mode === "category" ? (
                      <>{item.category_name}</>
                    ) : mode === "sticker" ? (
                      <>{item.figure_name}</>
                    ) : (
                      <>{item.item_name}</>
                    )}
                  </span>
                </li>
              </motion.div>
            ))}
          </>
        </div>
      ) : (
        <>
          {/* <div className="w-full h-[540px] flex flex-col justify-center items-center">
            <h2 className="text-xl">PARECE QUE AQUI TÁ VAZIO...</h2>
            <Frown size={30} />
          </div> */}
        </>
      )}
    </ul>
  );
};

export default ReusableList;
