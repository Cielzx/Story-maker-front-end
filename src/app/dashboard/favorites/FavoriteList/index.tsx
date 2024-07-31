import { useCategory, useSticker } from "@/hooks";
import { favoriteData } from "@/schemas/favorite.schema";
import { Trash } from "lucide-react";

interface props {
  items: favoriteData[];
}

const FavoriteList = ({ items }: props) => {
  const { deleteFavorite } = useSticker();
  const { getSubCategorie } = useCategory();
  return (
    <ul className="w-full h-full overflow-y-auto justify-between flex flex-wrap gap-2 p-0">
      {items && items.length > 0 ? (
        <>
          {items.map((item) => (
            <li
              key={item.id}
              className="w-[50%] h-[40%] min-[940px]:w-[30%] min-[940px]:h-[240px] flex items-start group justify-center relative rounded-lg"
              style={{
                backgroundImage: `url(${item.sticker.figure_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="w-full flex justify-end hidden group-hover:flex text-white p-1">
                <Trash onClick={() => deleteFavorite(item.id)} size={20} />
              </div>
              <span className="absolute text-[4vw]  font-semibold font-nixie bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md cursor-pointer">
                {item.sticker.figure_name}
              </span>
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
