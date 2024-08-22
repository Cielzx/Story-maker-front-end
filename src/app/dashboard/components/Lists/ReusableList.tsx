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

  async function writeImageToClipboard(url: string, color: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    if (!response.ok) {
      throw new Error("Falha ao buscar a imagem");
    }

    const img = new Image();
    const svgText = await blob.text();
    const coloredSvgText = svgText
      .replace(/fill="[^"]*"/g, "")
      .replace(/<svg([^>]+)>/, `<svg$1 fill="${color}">`)
      .replace(/<svg([^>]+)>/, `<svg$1 opacity="${opacity}">`);
    const svgBlob = new Blob([coloredSvgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
    const loadImage = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        img.src = svgUrl;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    const loadedImg = await loadImage();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = loadedImg.width;
    canvas.height = loadedImg.height;

    ctx?.drawImage(loadedImg, 0, 0);

    const writeItem = async () => {
      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, "image/png");
      });
    };

    const result = await writeItem();

    return result;
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

  const handleColorChange = (color: any) => {
    setColor(color.hex);
    setRgbColor(color.rgb);
  };

  const handleOpacityChange = (event: any) => {
    setOpacity(event.target.value);
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
          <div className="flex absolute w-[300px] h-[60%] right-[0%] top-[25%]">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="mb-2 p-2 z-30 rounded absolute top-[41%] left-[80%]  "
            >
              <img
                src="https://imgur.com/GP2GJgq.png"
                className="w-[40px] h-[40px]"
                alt=""
              />
            </button>
            {showPicker ? (
              <div
                className="w-[179px] h-[315px] relative left-[23%] top-[15%] bg-white rounded-md z-10 p-2"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px",
                }}
              >
                <SketchPicker
                  width="100%"
                  color={color}
                  styles={{
                    default: {
                      picker: {
                        padding: "0rem",
                        border: "1px solid transparent",
                        boxShadow: "none",
                        color: "black",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  disableAlpha
                  onChange={handleColorChange}
                />

                <div
                  className="w-full h-3 flex justify-center"
                  style={{
                    backgroundImage:
                      "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAQCAYAAAD06IYnAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIWDwYQlZMa3gAAAWVJREFUaN7tmEGO6jAQRCsOArHgBpyAJYGjcGocxAm4A2IHpmoWE0eBH+ezmFlNvU06shJ3W6VEelWMUQAIIF9f6qZpimsA1LYtS2uF51/u27YVAFZVRUkEoGHdPV/sIcbIEIIkUdI/9Xa7neyv61+SWFUVAVCSct00TWn2fv6u3+Ecfd3tXzy/0+nEUu+SPjo/kqzrmiQpScN6v98XewfA8/lMkiLJ2WxGSUopcT6fM6U0NX9/frfbjev1WtfrlZfLhYfDQQHG/AIOlnGwjINlHCxjHCzjYJm/TJWdCwquJXseFFzGwDNNeiKMOJTO8xQdDQaeB29+K9efeLaBo9J7vdvtJj1RjFFjfiv7qv95tjx/7leSQgh93e1ffMeIp6O+YQjho/N791t1XVOSSI7N//K+4/GoxWLBx+PB5/Op5XLJ+/3OlJJWqxU3m83ovv5iGf8KjYNlHCxjHCzjYBkHy5gf5gusvQU7U37jTAAAAABJRU5ErkJggg==)",
                    backgroundSize: "100% 100%",
                  }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    className="w-full  h-[0.90rem] rounded-sm cursor-pointer"
                    style={{
                      background: `linear-gradient(280deg, rgba(${rgbcolor.r},${rgbcolor.g},${rgbcolor.b},0.8) 46%, rgba(47,33,34,0.2) 100%)`,
                      border: "1px solid black",
                    }}
                    value={opacity}
                    onChange={handleOpacityChange}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}

        {filteredItems && filteredItems.length > 0 ? (
          <ul className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 p-2">
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
                      item={item}
                      svgUrl={item.figure_image}
                      writeImageToClipboard={writeImageToClipboard}
                      favoriteIds={favoriteIds}
                      handleFavoriteClick={handleFavoriteClick}
                      color={color}
                      opacity={opacity}
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
    </ul>
  );
};

export default ReusableList;
