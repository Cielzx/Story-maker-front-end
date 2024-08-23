import Toast from "@/app/components/Toast";
import { useSticker } from "@/hooks";
import { Heart, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

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
  const { deleteSticker } = useSticker();
  return (
    <li className="w-full h-full flex flex-col z-[5px] border border-1 relative border-s-white rounded-md relative group">
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
          fill={favoriteIds.includes(item.id) ? "red" : "transparent"}
          onClick={() => {
            handleFavoriteClick(item);
          }}
        />
      </div>

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
        }}
      />

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
        className="w-full font-semibold h-[40px] z-[10px] absolute items-center hidden group-hover:flex group-hover:text-center  bottom-[0%]  flex justify-center  rounded-md bg-purple-400"
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
