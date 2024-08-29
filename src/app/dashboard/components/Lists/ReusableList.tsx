"use client";
import Loading from "@/app/components/Loading";
import { useCategory, useSticker, useUSer } from "@/hooks";
import { CombineCategorySchema } from "@/schemas/category.schema";
import { motion } from "framer-motion";
import { Edit, Heart, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import UpdateModal from "../updateModal";
import Sticker from "./components/sticker";

interface props {
  items: CombineCategorySchema[];
  id?: string;
  subId?: string;
  search?: string;
}

import {
  AlphaPicker,
  ChromePicker,
  SketchPicker,
  SwatchesPicker,
} from "react-color";
import { IoIosColorPalette } from "react-icons/io";
import { resolve } from "path";
import { ReactSVG } from "react-svg";
import ColorPicker from "@/app/components/ColorPicker";

const ReusableList = ({ items, search }: props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { deleteCategory, deleteSubCategory } = useCategory();
  const {
    deleteSticker,
    createFavorite,
    getSticker,
    sticker,
    writeImageToClipboard,
  } = useSticker();
  const { mode, setMode, user } = useUSer();
  const [clientMode, setClientMode] = useState("");
  const [height, setHeight] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [color, setColor] = useState("#FFFFFFFF");
  const [rgbcolor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
  const [id, setId] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [opacity, setOpacity] = useState(1);

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

    if (clientMode === "subCategory") {
      filteredItems = items.filter((item) => {
        if (clientMode === "subCategory" && items) {
          return item.item_name
            .toLocaleLowerCase()
            .includes(search!.toLocaleLowerCase());
        }
      });
    }
  }

  if (!search) {
    filteredItems = items;
  }

  const handleColorChange = (color: any) => {
    setColor(color.hex);
    setRgbColor(color.rgb);
  };

  const handleOpacityChange = (event: any) => {
    setOpacity(event.target.value);
  };
  return (
    <div className="w-full h-full flex flex-wrap gap-2 p-3 ">
      <div
        className="w-full h-full overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {mode === "sticker" ? (
          <ColorPicker
            color={color}
            opacity={opacity}
            handleColorChange={handleColorChange}
            handleOpacityChange={handleOpacityChange}
            setShowPicker={setShowPicker}
            showPicker={showPicker}
            rgbcolor={rgbcolor}
          />
        ) : (
          <></>
        )}

        {filteredItems && filteredItems.length > 0 ? (
          <ul className="w-full   grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
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
                  <Sticker
                    item={item}
                    svgUrl={item.figure_image}
                    writeImageToClipboard={writeImageToClipboard}
                    favoriteIds={favoriteIds}
                    handleFavoriteClick={handleFavoriteClick}
                    color={color}
                    opacity={opacity}
                  />
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

                    <div className="w-full flex items-center h-[18%] absolute bottom-2 p-1">
                      <span
                        className="font-semibold font-nixie  bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer"
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
                    </div>
                  </li>
                )}
              </motion.div>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>

      {user.is_admin ? (
        <UpdateModal isOpen={isOpen} onClose={onClose} id={id} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ReusableList;
