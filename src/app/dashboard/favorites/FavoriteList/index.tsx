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
    <ul className="w-full h-full overflow-y-auto justify-between flex flex-wrap gap-2 p-2">
      {items && items.length > 0 ? (
        <>
          {items.map((item) => (
            <li
              key={item.id}
              className="w-[50%] border border-1 relative border-s-white h-[40%] min-[940px]:w-[30%] min-[940px]:h-[240px] flex flex-col items-start group justify-center relative rounded-lg"
              style={{
                backgroundImage: `url(${item.sticker.figure_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="w-full flex justify-end absolute top-[0%] z-[10] hidden group-hover:flex text-white p-1">
                <Trash onClick={() => deleteFavorite(item.id)} size={20} />
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
