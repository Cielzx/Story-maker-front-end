import Toast from "@/app/components/Toast";
import { useSticker } from "@/hooks";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { ReactSVG } from "react-svg";

interface RecentProps {
  stickers: {
    id: string;
    figure_image: string;
    created_at: string;
  }[];
}

const RecentList = ({ stickers }: RecentProps) => {
  const { writeImageToClipboard } = useSticker();

  const beforeInjection = useCallback((svg: SVGSVGElement) => {
    const paths = svg.querySelectorAll("path");
    paths.forEach((path) => {
      path.setAttribute("fill", "#FFFFF");
    });
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }, []);

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div
      className="w-full h-full overflow-x-scroll"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <ul className="w-full h-full gap-2 flex flex-nowrap p-1">
        {stickers &&
          stickers
            .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
            .slice(0, 10)
            .map((sticker) => (
              <>
                <li
                  onClick={async () => {
                    try {
                      await navigator.clipboard.write([
                        new ClipboardItem({
                          "image/png": writeImageToClipboard(
                            sticker.figure_image,
                            "#FFFF",
                            1
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
                  className="w-auto h-auto flex flex-col z-[5] rounded-lg relative group"
                  style={{
                    boxShadow: "rgba(255, 255, 255, 0.753) 0px 2px 4px -1px",
                    minWidth: "83px",
                    flex: "1 1 150px",
                  }}
                >
                  <div className="w-full h-full z-5 flex justify-between p-1">
                    {sticker && sticker.figure_image.endsWith("svg") ? (
                      <ReactSVG
                        src={sticker.figure_image}
                        className="w-full h-full rounded-lg"
                        beforeInjection={beforeInjection}
                        wrapper="svg"
                      />
                    ) : (
                      <img
                        src={sticker.figure_image}
                        alt="Sticker"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}

                    {/* <button className="w-full font-semibold h-[40px] z-[10] absolute items-center hidden group-hover:flex group-hover:text-center bottom-[0%] flex justify-center rounded-md bg-purple-400 cursor-pointer">
                <p
                  style={{
                    fontSize: "clamp(0.5rem, 1vw + 1rem, 1rem)",
                  }}
                >
                  Copiar figurinha
                </p>
              </button> */}
                  </div>
                </li>
              </>
            ))}
      </ul>
    </div>
  );
};

export default RecentList;
