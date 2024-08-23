"use client";
import { useCategory, useSticker } from "@/hooks";
import { favoriteData } from "@/schemas/favorite.schema";
import { Heart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

interface props {
  items: favoriteData[];
}

const FavoriteList = ({ items }: props) => {
  const { deleteFavorite } = useSticker();
  const { getSubCategorie } = useCategory();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavoriteIds(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <ul className="w-[90%] h-[90%] overflow-y-auto justify-between grid grid-cols-2 gap-2 p-2">
      {items && items.length > 0 ? (
        <>
          {items.map((item) => (
            <li
              key={item.id}
              className="w-full h-[300px] border border-1 relative border-s-white flex flex-col items-start group justify-center relative rounded-lg"
            >
              <div className="w-full h-full flex justify-end absolute top-[0%] z-[10]  group-hover:flex text-white p-1">
                {/* <Trash onClick={() => deleteFavorite(item.id)} size={20} /> */}

                <Heart size={20} className="z-[10]" fill="red" />
              </div>

              <ReactSVG
                key={item.id}
                src={item.sticker.figure_image}
                className="w-full "
                beforeInjection={(svg) => {
                  svg.querySelectorAll("path").forEach((path) => {
                    path.setAttribute("fill", "#FFFFFF");
                  }, []);
                  svg.setAttribute("width", "100%");
                  svg.setAttribute("height", "200px");
                }}
              />
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
