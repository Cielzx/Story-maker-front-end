"use client";
import { useCategory, useSticker } from "@/hooks";
import { favoriteData } from "@/schemas/favorite.schema";
import { Heart, Trash } from "lucide-react";
import { useEffect, useState } from "react";

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
    <ul className="w-full overflow-y-auto justify-between grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 p-2">
      {items && items.length > 0 ? (
        <>
          {items.map((item) => (
            <li
              key={item.id}
              className="border border-1 relative border-s-white  min-[940px]:w-[30%] min-[940px]:h-[240px] max-md:h-[190px] flex flex-col items-start group justify-center relative rounded-lg"
              style={{
                backgroundImage: `url(${item.sticker.figure_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="w-full flex justify-end absolute top-[0%] z-[10]  group-hover:flex text-white p-1">
                {/* <Trash onClick={() => deleteFavorite(item.id)} size={20} /> */}

                <Heart size={20} className="z-[10]" fill="red" />
              </div>
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
