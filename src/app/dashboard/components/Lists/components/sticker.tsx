import Toast from "@/app/components/Toast";
import { useSticker, useUSer } from "@/hooks";
import { Heart, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import Pallet from "../components/img/pallete.png";

interface stickerProps {
  svgUrl: string;
  writeImageToClipboard(url: string, color: string): Promise<Blob>;
  item: any;
  favoriteIds: string[];
  handleFavoriteClick: (item: any) => void;
  color: string;
  opacity: number;
}

const Sticker = ({
  svgUrl,
  writeImageToClipboard,
  item,
  favoriteIds,
  handleFavoriteClick,
  color,
  opacity,
}: stickerProps) => {
  const [isSvg, setIsSvg] = useState<boolean>(true);
  const { user } = useUSer();
  const { deleteSticker } = useSticker();

  useEffect(() => {
    setIsSvg(item.figure_image?.endsWith(".svg"));
  }, [svgUrl]);

  return (
    <li
      className="w-full h-full flex flex-col z-[5px] rounded-lg relative group"
      style={{
        boxShadow: "rgba(255, 255, 255, 0.753) 0px 2px 4px -1px",
      }}
    >
      <div className="w-full h-full z-10 flex hidden absolute  group-hover:flex justify-between p-1">
        {user && user.is_admin ? (
          <Trash
            onClick={() => {
              deleteSticker(item.id);
            }}
            size={20}
            color="white"
            fill="black"
          />
        ) : (
          <></>
        )}

        <Heart
          size={20}
          className="z-[10]"
          fill={favoriteIds.includes(item.id) ? "red" : "transparent"}
          onClick={() => {
            handleFavoriteClick(item);
          }}
        />
      </div>

      {isSvg ? (
        <img
          src="https://images2.imgbox.com/ef/4e/BzXeOtCi_o.png"
          className="w-[20px] h-[20px] absolute top-[4%]"
          alt="color-circle"
        />
      ) : (
        <></>
      )}

      {isSvg ? (
        <ReactSVG
          key={item.id}
          src={svgUrl}
          className="w-full h-full"
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
          src={item.figure_image}
          alt={item.item_name}
          className="w-full h-full object-contain"
        />
      )}

      <button
        onClick={async () => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": writeImageToClipboard(item.figure_image, color),
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
  );
};

export default Sticker;
