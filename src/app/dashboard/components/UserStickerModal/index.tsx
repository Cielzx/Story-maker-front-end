import CustomModal from "@/app/components/Modal";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import FontWrapper from "./components/FontWrapper";
import ActionButton from "./components/ActionButton";
import { ChromePicker } from "react-color";
import IconWrapper from "./components/iconWrapper";
import StickerCanvas from "../StickerCreation";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  modalSticker: boolean;
  id?: string;
}

export interface textProps {
  id: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  text: string;
  opacity: number;
  letterSpacing: number;
  strokeWidth: number;
  image: string;
  iconHeight: number;
}
export interface modalModeProps {
  text: boolean;
  font: boolean;
  family: boolean;
  fill: boolean;
  opacity: boolean;
  fontSize: boolean;
  letterSpacing: boolean;
  strokeWidth: boolean;
  icon: boolean;
  iconHeight: boolean;
}

interface Font {
  label: string;
  fontName: string;
  value: string;
}

const UserStickerModal = ({ isOpen, onClose, modalSticker }: modalProps) => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [textProps, setTextProps] = useState({
    id: 1,
    fontSize: 50,
    fontFamily: "Arial",
    fill: "#faf8f8",
    text: "Olá :)",
    opacity: 1,
    letterSpacing: 0,
    strokeWidth: 0,
    image: "",
    iconHeight: 100,
  });

  const [texts, setTexts] = useState<textProps[]>([
    { ...textProps, id: 1 }, // Texto inicial
  ]);
  const [nextId, setNextId] = useState(2);
  const [currentText, setCurrentText] = useState<string>("");

  const [images, setImages] = useState<
    { id: number; image: HTMLImageElement; removed: boolean }[]
  >([]);

  const [modalMode, setModalMode] = useState({
    text: false,
    font: false,
    family: false,
    fill: false,
    opacity: false,
    fontSize: false,
    letterSpacing: false,
    strokeWidth: false,
    icon: false,
    iconHeight: false,
  });
  let value: string | number = "";

  if (modalMode.fontSize) {
    value = textProps.fontSize;
  }

  if (modalMode.opacity) {
    value = textProps.opacity * 100;
  }

  if (modalMode.letterSpacing) {
    value = textProps.letterSpacing;
  }
  if (modalMode.strokeWidth) {
    value = textProps.strokeWidth;
  }

  if (modalMode.iconHeight) {
    value = textProps.iconHeight;
  }

  const handleColorChange = (color: any) => {
    setTextProps({ ...textProps, fill: color.hex });
  };

  useEffect(() => {
    async function fetchFonts() {
      try {
        const response = await fetch("/api/fonts");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFonts(data);

        data.forEach((font: Font) => {
          const style = document.createElement("style");
          style.textContent = `@font-face {
            font-family: '${font.label}';
            src: url('${font.value}');
          }`;
          document.head.appendChild(style);
        });
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    }

    fetchFonts();
  }, [isOpen]);

  return (
    <CustomModal
      isOpen={isOpen}
      headerText={"Crie sua figurinha"}
      onClose={onClose}
      MaxWidthBody="80%"
      MaxWidthHeader="100%"
      widthBody="100%"
      widthHeader="100%"
      heightBody="100%"
    >
      {modalMode.font ? (
        <FontWrapper
          fonts={fonts}
          textProps={textProps}
          modalMode={modalMode}
          setTextProps={setTextProps}
          setModalMode={setModalMode}
        />
      ) : (
        <></>
      )}

      {modalMode.icon ? (
        <IconWrapper
          modalMode={modalMode}
          setModalMode={setModalMode}
          textProps={textProps}
          setTextProps={setTextProps}
          images={images}
          setImages={setImages}
        />
      ) : (
        <></>
      )}
      <div className="w-full h-full flex flex-col h-full">
        <section className="w-full h-full flex flex-col relative">
          <div className="w-full h-full relative">
            <StickerCanvas
              textProps={textProps}
              setTextProps={setTextProps}
              nextId={nextId}
              setNextId={setNextId}
              texts={texts}
              setTexts={setTexts}
              currentText={currentText}
              setCurrentText={setCurrentText}
              images={images}
              setImages={setImages}
              modalMode={modalMode}
              setModalMode={setModalMode}
            />

            <div className="w-full bg-black h-[70px] flex gap-2 relative justify-center items-center  text-white">
              <div>
                {modalMode.fill ? (
                  <ChromePicker
                    className="absolute bottom-20 right-0"
                    color={textProps.fill}
                    onChange={handleColorChange}
                    disableAlpha
                  />
                ) : (
                  <></>
                )}
              </div>

              {modalMode.fontSize ||
              modalMode.opacity ||
              modalMode.letterSpacing ||
              modalMode.strokeWidth ||
              modalMode.iconHeight ? (
                <div className="w-full h-full z-[5] flex justify-center gap-2 items-center absolute bg-gray-700">
                  <div className="w-[80%] h-[20px] border border-black rounded-md">
                    <input
                      type="range"
                      min={
                        modalMode.strokeWidth
                          ? "0"
                          : "" || modalMode.iconHeight
                          ? "5"
                          : ""
                      }
                      max={
                        modalMode.strokeWidth
                          ? "5"
                          : "" || modalMode.iconHeight
                          ? "300"
                          : ""
                      }
                      value={value}
                      onChange={(e) => {
                        {
                          if (modalMode.fontSize) {
                            setTextProps({
                              ...textProps,
                              fontSize: +e.currentTarget.value,
                            });
                          } else if (modalMode.opacity) {
                            setTextProps({
                              ...textProps,
                              opacity: +e.currentTarget.value / 100,
                            });
                          } else if (modalMode.letterSpacing) {
                            setTextProps({
                              ...textProps,
                              letterSpacing: +e.currentTarget.value,
                            });
                          } else if (modalMode.strokeWidth) {
                            setTextProps({
                              ...textProps,
                              strokeWidth: +e.currentTarget.value,
                            });
                          } else if (modalMode.iconHeight) {
                            setTextProps({
                              ...textProps,
                              iconHeight: +e.currentTarget.value,
                            });
                          }
                        }
                      }}
                      className="w-full h-full bg-gray-600 border z-[5] rounded-md outline-none border-none text-white "
                    />
                  </div>

                  <CircleCheck
                    className="cursor-pointer"
                    onClick={() => {
                      if (modalMode.fontSize) {
                        setModalMode({
                          ...modalMode,
                          fontSize: !modalMode.fontSize,
                        });
                      } else if (modalMode.opacity) {
                        setModalMode({
                          ...modalMode,
                          opacity: !modalMode.opacity,
                        });
                      } else if (modalMode.letterSpacing) {
                        setModalMode({
                          ...modalMode,
                          letterSpacing: !modalMode.letterSpacing,
                        });
                      } else if (modalMode.strokeWidth) {
                        setModalMode({
                          ...modalMode,
                          strokeWidth: !modalMode.strokeWidth,
                        });
                      } else if (modalMode.iconHeight) {
                        setModalMode({
                          ...modalMode,
                          iconHeight: !modalMode.iconHeight,
                        });
                      }
                    }}
                    size={30}
                    fill="white"
                    color="black"
                  />
                </div>
              ) : (
                <></>
              )}

              <ActionButton
                modalMode={modalMode}
                setModalMode={setModalMode}
                nextId={nextId}
                setNextId={setNextId}
                currentText={currentText}
                setCurrentText={setCurrentText}
                texts={texts}
                textProps={textProps}
                setTexts={setTexts}
              />
            </div>
          </div>
        </section>
      </div>
    </CustomModal>
  );
};

export default UserStickerModal;
