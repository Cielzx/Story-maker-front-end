"use client";
import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import { useCategory, useSticker, useUSer } from "@/hooks";
import { CombineCategorySchema } from "@/schemas/category.schema";
import { motion } from "framer-motion";
import { Edit, Frown, Heart, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface props {
  items: CombineCategorySchema[];
  id?: string;
  subId?: string;
  search?: string;
}

const ReusableList = ({ items, id, subId, search }: props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { deleteCategory, deleteSubCategory } = useCategory();
  const {
    deleteSticker,
    createFavorite,
    getSticker,
    sticker,
    copyImageToClipboard,
  } = useSticker();
  const { mode, setMode, user } = useUSer();
  const [clientMode, setClientMode] = useState("");
  const [clicked, setIsClicked] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState("");

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

  async function writeImageToClipboard(url: string) {
    const p = new Promise<void>(async (resolve, reject) => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "clipboard-write" as PermissionName,
        });
        if (
          permissionStatus.state !== "granted" &&
          permissionStatus.state !== "prompt"
        ) {
          reject(
            new DOMException(
              "NotAllowedError",
              "Clipboard permission not granted"
            )
          );
          return;
        }
      } catch (e) {}

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao buscar a imagem");
        }
        const blob = await response.blob();

        const supportedTypes = ["image/png", "image/jpeg", "image/gif"];
        if (!supportedTypes.includes(blob.type)) {
          reject(new DOMException("NotAllowedError", "Unsupported MIME type"));
          return;
        }

        const cleanBlob = new Blob([blob], { type: blob.type });

        const clipboardItem = new ClipboardItem({
          [cleanBlob.type]: cleanBlob,
        });

        setTimeout(() => {
          navigator.clipboard.write([clipboardItem]);
        }, 0);

        resolve();

        Toast({
          message: "Figurinha copiada",
          isSucess: true,
        });
      } catch (error: any) {
        reject(new DOMException("NotAllowedError", error.message));
      }
    });

    return p;
  }

  useEffect(() => {
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

    setClientMode(mode);
  }, [mode]);

  if (!user) {
    return <Loading />;
  }

  const handleFavoriteClick = async (item: any) => {
    createFavorite(user.id, sticker!.id);
  };

  const handleFocus = (id: string) => {
    getSticker(id);
    setFocusedIndex(id);
  };
  window.Clipboard;

  // const handleClipboard = async (imageSrc: string) => {
  //   const response = await fetch(imageSrc);
  //   if (!response.ok) {
  //     throw new Error("Falha ao buscar a imagem.");
  //   }

  //   if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
  //     const blob = await response.blob();
  //     const makeImagePromise = async () => {
  //       const data = await fetch(imageSrc);
  //       return await data.blob();
  //     };
  //     await navigator.clipboard.write([
  //       new ClipboardItem({ [blob.type]: makeImagePromise() }),
  //     ]);
  //   }

  //   if (typeof navigator.clipboard.write === "function") {
  //     const clipboardItem = new ClipboardItem({
  //       "image/png": "blob",
  //     });

  //     // navigator.clipboard.write([clipboardItem]);

  //     Toast({
  //       message: "Figurinha copiada",
  //       isSucess: true,
  //     });
  //   } else {
  //     const blob = response.blob();

  //     const record: any = new Object();
  //     Reflect.set(record, "image/png", blob);

  //     const item = new ClipboardItem(record);

  //     const data = [item];

  //     const clipboard = navigator.clipboard;

  //     await clipboard.write(data);

  //     Toast({
  //       message: "Figurinha copiada 2",
  //       isSucess: true,
  //     });
  //   }
  // };

  const handleBlur = () => {
    setFocusedIndex("");
  };

  if (!user) {
    return <Loading />;
  }

  if (!items) {
    return <Loading />;
  }
  let filteredItems;

  if (search) {
    if (clientMode === "category") {
      filteredItems = items.filter((item) => {
        if (clientMode === "category" && items) {
          return item.category_name
            .toLocaleLowerCase()
            .includes(search!.toLocaleLowerCase());
        }
      });
    }
  }

  if (!search) {
    filteredItems = items;
  }
  return (
    <ul className="w-full h-full flex flex-wrap gap-2 p-3">
      <div className="w-full h-full overflow-y-scroll">
        {filteredItems && filteredItems.length > 0 ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="w-[100%] h-[300px]"
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundImage: `url(${
                    mode === "sticker" ? item.figure_image : item.cover_image
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <li
                  key={item.id}
                  tabIndex={0}
                  onFocus={() => handleFocus(item.id)}
                  onBlur={handleBlur}
                  className="w-full h-full  flex items-start group justify-center relative rounded-lg"
                >
                  <div className="w-full flex hidden group-hover:flex justify-between p-1">
                    {user!.is_admin ? (
                      <>
                        <Edit size={20} />
                        <Trash
                          onClick={() => {
                            if (clientMode === "category") {
                              deleteCategory(item.id);
                            } else if (clientMode === "subCategory") {
                              deleteSubCategory(item.id);
                            } else if (clientMode === "sticker") {
                              deleteSticker(item.id);
                            }
                          }}
                          size={20}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    {clientMode === "sticker" ? (
                      <Heart
                        size={20}
                        className="z-[10]"
                        fill={clicked ? "red" : "transparent"}
                        onClick={() => {
                          handleFavoriteClick(item);
                          setIsClicked(true);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>

                  <span
                    onClick={() => handleRedirect(item.id)}
                    className="absolute text-[4vw]  font-semibold font-nixie bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer"
                  >
                    {clientMode === "category" ? (
                      <>{item.category_name}</>
                    ) : clientMode === "sticker" ? (
                      <>{item.figure_name}</>
                    ) : (
                      <>{item.item_name}</>
                    )}
                  </span>

                  {mode === "sticker" ? (
                    <button
                      onClick={() => writeImageToClipboard(item.figure_image)}
                      className="w-full font-semibold h-[40px] z-[10px] items-center absolute bottom-[0%] hidden flex justify-center group-hover:flex group-hover:text-center rounded-sm bg-purple-400"
                    >
                      <p className="text-lg">Copiar figurinha</p>
                    </button>
                  ) : (
                    <></>
                  )}
                </li>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            {/* <div className="w-full h-[540px] flex flex-col justify-center items-center">
            <h2 className="text-xl">PARECE QUE AQUI TÁ VAZIO...</h2>
            <Frown size={30} />
          </div> */}
          </>
        )}
      </div>
    </ul>
  );
};

export default ReusableList;
