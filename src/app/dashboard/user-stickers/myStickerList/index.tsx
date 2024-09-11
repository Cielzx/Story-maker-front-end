import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import { useSticker } from "@/hooks";
import { Trash } from "lucide-react";
import { ReactSVG } from "react-svg";

interface props {
  items: {
    id: string;
    figure_image: string;
    userId: string;
  }[];
  color: string;
  opacity: number;
}

const MyStickerList = ({ items, color, opacity }: props) => {
  const { writeImageToClipboard, deleteSticker } = useSticker();

  if (!items) {
    return <Loading />;
  }

  return (
    <ul className="w-[90%] h-[90%] overflow-y-auto justify-between grid grid-cols-2 gap-2 p-2">
      {items && (
        <>
          {items.map((item) => (
            <li
              key={item.id}
              className="w-full h-[300px] z-[5px] group relative flex flex-col items-start group justify-center relative rounded-lg"
              style={{
                boxShadow: "rgba(255, 255, 255, 0.753) 0px 2px 4px -1px",
              }}
            >
              <div className="w-full h-full flex justify-end hidden group-hover:flex absolute top-[0%] z-[5px]  group-hover:flex text-white p-1">
                <Trash
                  onClick={() => deleteSticker(item.id, item.userId)}
                  size={20}
                />
              </div>

              {item.figure_image && item.figure_image.endsWith("svg") ? (
                <img
                  src="https://images2.imgbox.com/ef/4e/BzXeOtCi_o.png"
                  className="w-[20px] h-[20px] absolute top-[2%] left-[3%]"
                  alt="color-circle"
                />
              ) : (
                <></>
              )}

              {item.figure_image && item.figure_image.endsWith("svg") ? (
                <ReactSVG
                  key={item.id}
                  src={item.figure_image}
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
                  src={item.figure_image}
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
                className="w-full font-semibold h-[40px] z-[5px] absolute items-center hidden group-hover:flex group-hover:text-center  bottom-[0%]  flex justify-center  rounded-md bg-purple-400 cursor-pointer"
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
      )}
    </ul>
  );
};

export default MyStickerList;
