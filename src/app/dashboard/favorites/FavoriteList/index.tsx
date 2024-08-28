"use client";
import Toast from "@/app/components/Toast";
import { useCategory, useSticker } from "@/hooks";
import { favoriteData } from "@/schemas/favorite.schema";
import { Heart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

interface props {
  items: favoriteData[];
  color: string;
  opacity: number;
}

const FavoriteList = ({ items, color, opacity }: props) => {
  const { writeImageToClipboard } = useSticker();
  const [isSvg, setIsSvg] = useState<boolean>(true);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavoriteIds(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <ul className="w-[90%] h-[90%] overflow-y-auto justify-between grid grid-cols-2 gap-2 p-2">
      {items ? (
        <>
          {items.map((item) => (
            <li
              key={item.id}
              className="w-full h-[300px] z-[5px] relative flex flex-col items-start group justify-center relative rounded-lg"
              style={{
                boxShadow: "rgba(255, 255, 255, 0.753) 0px 2px 4px -1px",
              }}
            >
              <div className="w-full h-full flex justify-end absolute top-[0%] z-[5px]  group-hover:flex text-white p-1">
                {/* <Trash onClick={() => deleteFavorite(item.id)} size={20} /> */}

                <Heart size={20} className="z-[5px]" fill="red" />
              </div>

              {item.sticker.figure_image.endsWith("svg") ? (
                <img
                  src="https://images2.imgbox.com/ef/4e/BzXeOtCi_o.png"
                  className="w-[20px] h-[20px] absolute top-[4%]"
                  alt="color-circle"
                />
              ) : (
                <></>
              )}

              {item.sticker.figure_image.endsWith("svg") ? (
                <ReactSVG
                  key={item.id}
                  src={item.sticker.figure_image}
                  className="w-full "
                  beforeInjection={(svg) => {
                    svg.querySelectorAll("path").forEach((path) => {
                      path.setAttribute("fill", color);
                      path.setAttribute("opacity", `${opacity}`);
                    }, []);
                    svg.setAttribute("width", "100%");
                    svg.setAttribute("height", "200px");
                    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
                  }}
                />
              ) : (
                <img
                  src={item.sticker.figure_image}
                  alt={item.sticker.figure_name}
                  className="w-full h-full object-contain"
                />
              )}

              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.write([
                      new ClipboardItem({
                        "image/png": writeImageToClipboard(
                          item.sticker.figure_image,
                          color,
                          opacity
                        ),
                      }),
                    ]);

                    Toast({
                      message: "Figurinha copiada",
                      isSucess: true,
                    });
                  } catch (error: any) {
                    console.log(`${error.name}`, `${error.message}`);
                  }
                }}
                className="w-full font-semibold h-[40px] z-[10] absolute items-center hidden group-hover:flex group-hover:text-center  bottom-[0%]  flex justify-center  rounded-md bg-purple-400 cursor-pointer"
              >
                <p
                  style={{
                    fontSize: "clamp(0.5rem, 1vw + 1rem, 1rem)",
                  }}
                >
                  Copiar figurinha
                </p>
              </button>
            </li>
          ))}
        </>
      ) : (
        <></>
      )}
    </ul>
  );
};

export default FavoriteList;
