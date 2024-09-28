import Toast from "@/app/components/Toast";
import { useSticker, useUSer } from "@/hooks";
import { Heart, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

interface stickerProps {
  svgUrl: string;
  writeImageToClipboard(
    url: string,
    color: string,
    opacity: number
  ): Promise<Blob>;
  item: any;
  color: string;
  opacity: number;
}

const Sticker = ({
  svgUrl,
  writeImageToClipboard,
  item,
  color,
  opacity,
}: stickerProps) => {
  const [isSvg, setIsSvg] = useState<boolean>(true);
  const [favorite, setFavorite] = useState(true);
  const { user } = useUSer();
  const { deleteSticker, updateFavoriteSticker } = useSticker();

  const beforeInjection = useCallback(
    (svg: SVGSVGElement) => {
      const paths = svg.querySelectorAll("path");
      paths.forEach((path) => {
        path.setAttribute("fill", `${color}`);
        path.setAttribute("opacity", `${opacity}`);
      });
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    },
    [color, opacity]
  );

  const handleFavorite = async (item: any) => {
    const data = {
      is_favorited: favorite,
    };

    updateFavoriteSticker(data, item.id);
  };

  useEffect(() => {
    setIsSvg(item.figure_image?.endsWith(".svg"));
  }, [svgUrl]);

  return (
    <li
      key={item.id}
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
          className="z-[10] absolute right-1"
          fill={item.is_favorited ? "red" : "transparent"}
          onClick={() => {
            setFavorite(!favorite);

            handleFavorite(item);
          }}
        />
      </div>

      {isSvg ? (
        <img
          src="https://images2.imgbox.com/ef/4e/BzXeOtCi_o.png"
          className="w-[20px] h-[20px] absolute top-[2%] left-[3%]"
          alt="color-circle"
        />
      ) : (
        <></>
      )}

      {isSvg ? (
        <ReactSVG
          src={svgUrl}
          className="w-full h-full"
          beforeInjection={beforeInjection}
          wrapper="svg"
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
                "image/png": writeImageToClipboard(
                  item.figure_image,
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
  );
};

export default Sticker;
