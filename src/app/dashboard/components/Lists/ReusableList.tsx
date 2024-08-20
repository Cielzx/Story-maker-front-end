"use client";
import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import { useCategory, useSticker, useUSer } from "@/hooks";
import { CombineCategorySchema } from "@/schemas/category.schema";
import { motion } from "framer-motion";
import { Edit, Frown, Heart, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Canvg } from "canvg";
import CategoryModal from "../categoryModal";
import { useDisclosure } from "@chakra-ui/react";
import UpdateModal from "../updateModal";
import Sticker from "./components/sticker";

interface props {
  items: CombineCategorySchema[];
  id?: string;
  subId?: string;
  search?: string;
}

import { ChromePicker, SketchPicker, SwatchesPicker } from "react-color";
import { IoIosColorPalette } from "react-icons/io";
import { resolve } from "path";

const ReusableList = ({ items, search }: props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { deleteCategory, deleteSubCategory } = useCategory();
  const { deleteSticker, createFavorite, getSticker, sticker } = useSticker();
  const { mode, setMode, user } = useUSer();
  const [clientMode, setClientMode] = useState("");
  const [height, setHeight] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [color, setColor] = useState("#FFFFFFFF");
  const [id, setId] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [data, setData] = useState<ClipboardItem[]>([]);

  const { isOpen, onClose, onOpen } = useDisclosure();

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

  async function writeImageToClipboard(url: string, color: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      if (!response.ok) {
        throw new Error("Falha ao buscar a imagem");
      }

      const img = new Image();
      const svgText = await blob.text();
      const coloredSvgText = svgText
        .replace(/fill="[^"]*"/g, "")
        .replace(/<svg([^>]+)>/, `<svg$1 fill="${color}">`);
      const svgBlob = new Blob([coloredSvgText], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;

      setTimeout(() => {
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": new Promise((resolve) => {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const context = canvas.getContext("2d");
              context?.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                console.log(blob);
                if (blob) {
                  resolve(blob);
                }
                canvas.remove();
              }, "image/png");

              URL.revokeObjectURL(svgUrl);
            }),
          }),
        ]);
      }, 200);

      Toast({
        message: "Figurinha copiada",
        isSucess: true,
      });
      // img.onload = async () => {
      //   const canvas = document.createElement("canvas");
      //   const ctx = canvas.getContext("2d");

      //   canvas.width = img.width;
      //   canvas.height = img.height;

      //   ctx?.drawImage(img, 0, 0);

      //   canvas.toBlob(async (blob) => {
      //     if (blob) {
      //       const item = new ClipboardItem({
      //         "image/png": blob,
      //       });

      //       const data = [item];

      //       setTimeout(() => {
      //         navigator.clipboard.write(data);
      //       }, 100);

      //       Toast({
      //         message: "Figurinha copiada",
      //         isSucess: true,
      //       });
      //     }
      //   }, "image/png");
      // };

      // const item = new ClipboardItem({
      //   "image/png": blob,
      // });

      // const data = [item];

      // setTimeout(() => {
      //   navigator.clipboard.write(data);
      // }, 100);

      // Toast({
      //   message: "Figurinha copiada",
      //   isSucess: true,
      // });
    } catch (error: any) {
      Toast({
        message: "Algo deu errado",
        isSucess: false,
      });
    }
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

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavoriteIds(JSON.parse(savedFavorites));
    }

    if (clientMode === "category" || clientMode === "subCategory") {
      setHeight("300px");
    } else {
      setHeight("200px");
    }
  }, [clientMode]);

  if (!user) {
    return <Loading />;
  }

  const handleFavoriteClick = async (item: any) => {
    await getSticker(item.id);
    const updatedFavorites = [...favoriteIds];
    const favoriteIndex = updatedFavorites.indexOf(item.id);

    if (favoriteIndex === -1) {
      createFavorite(user.id, item.id);
      updatedFavorites.push(item.id);
    } else {
      updatedFavorites.splice(favoriteIndex, 1);
    }

    setFavoriteIds(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

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

  const colorToHue = (color: string): number => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const hue = (Math.atan2(g - b, 2 * r - g - b) * 180) / Math.PI;
    return hue;
  };

  const filter = `invert(2) sepia(1) saturate(5) hue-rotate(${colorToHue(
    color
  )}deg)`;

  const handleColorChange = (color: any) => {
    setColor(color.hex);
  };
  return (
    <ul className="w-full h-full flex flex-wrap gap-2 p-3">
      <div
        className="w-full h-full overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {mode === "sticker" ? (
          <>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="mb-2 p-2 z-30 rounded absolute top-[41%] left-[80%]  "
            >
              <IoIosColorPalette size={40} />
            </button>
            {showPicker && (
              <div className=" w-[120px] absolute left-[47%] top-[38%] z-10">
                <SketchPicker
                  width="100%"
                  color={color}
                  onChangeComplete={handleColorChange}
                />
              </div>
            )}
          </>
        ) : (
          <></>
        )}

        {filteredItems && filteredItems.length > 0 ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 p-2">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="w-[100%]"
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5 }}
                style={{
                  height: `${height}`,
                }}
              >
                {mode === "sticker" ? (
                  <>
                    <Sticker
                      svgUrl={item.figure_image}
                      filter={filter}
                      writeImageToClipboard={writeImageToClipboard}
                      item={item}
                      favoriteIds={favoriteIds}
                      color={color}
                      handleFavoriteClick={handleFavoriteClick}
                    />
                  </>
                ) : (
                  <li
                    key={item.id}
                    tabIndex={0}
                    className="w-full h-full  flex flex-col items-start group justify-between relative rounded-lg"
                    style={{
                      backgroundImage: `url(${
                        mode === "sticker"
                          ? item.figure_image
                          : item.cover_image
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="w-full flex hidden  group-hover:flex justify-between p-1">
                      {user!.is_admin ? (
                        <>
                          {mode === "sticker" ? (
                            <></>
                          ) : (
                            <Edit
                              size={20}
                              onClick={() => {
                                onOpen();
                                setId(item.id);
                                setMode("update");
                              }}
                            />
                          )}

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
                          fill={
                            favoriteIds.includes(item.id)
                              ? "red"
                              : "transparent"
                          }
                          onClick={() => {
                            handleFavoriteClick(item);
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </div>

                    {mode === "sticker" ? (
                      <></>
                    ) : (
                      <div
                        onClick={() => {
                          handleRedirect(item.id);
                        }}
                        className="w-[100%] h-[90%] z-10 absolute bottom-[0%]"
                      ></div>
                    )}

                    <span
                      className="absolute   font-semibold font-nixie bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer"
                      style={{
                        fontSize: "clamp(1rem, 1vw + 1rem, 1rem)",
                      }}
                    >
                      {clientMode === "category" ? (
                        <>{item.category_name}</>
                      ) : (
                        <>{item.item_name}</>
                      )}
                    </span>
                  </li>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>

      {user.is_admin ? (
        <UpdateModal isOpen={isOpen} onClose={onClose} id={id} />
      ) : (
        <></>
      )}
    </ul>
  );
};

export default ReusableList;
