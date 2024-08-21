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
  const [id, setId] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [navigatorBlob, setNavigatorBlob] = useState<Blob>();

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
      .replace(/<svg([^>]+)>/, `<svg$1 fill="${color}">`);
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
    const writeItem = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = loadedImg.width;
      canvas.height = loadedImg.height;

      ctx?.drawImage(loadedImg, 0, 0);

      return await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, "image/png");
      });
    };

    navigator.clipboard
      .write([
        new ClipboardItem({
          "image/png": writeItem(),
        }),
      ])
      .then(() => {
        Toast({
          message: "Figurinha copiada",
          isSucess: true,
        });
      })
      .catch((error) => {
        console.log("Erro", error),
          Toast({
            message: "Erro ao copiar figurinha",
            isSucess: false,
          });
      });

    URL.revokeObjectURL(svgUrl);
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
                    <div className="flex flex-col z-[5px] relative group">
                      <div className="w-full flex hidden absolute  group-hover:flex justify-between p-1">
                        <Trash
                          onClick={() => {
                            deleteSticker(item.id);
                          }}
                          size={20}
                        />

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
                      </div>
                      {/* <img src={svgUrl} style={{ filter }} alt="Sticker" /> */}

                      <ReactSVG
                        src={item.figure_image}
                        beforeInjection={(svg) => {
                          svg.querySelectorAll("path").forEach((path) => {
                            path.setAttribute("fill", color);
                          }, []);
                          svg.setAttribute("width", "100%");
                          svg.setAttribute("height", "100%");
                        }}
                      />

                      <button
                        onClick={() =>
                          writeImageToClipboard(item.figure_image, color)
                        }
                        className="w-full font-semibold h-[40px] z-[10px] absolute items-center hidden group-hover:flex group-hover:text-center  bottom-[0%]  flex justify-center  rounded-sm bg-purple-400"
                      >
                        <p className="text-lg">Copiar figurinha</p>
                      </button>
                    </div>
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
