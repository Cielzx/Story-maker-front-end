import { ArrowLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { modalModeProps, textProps } from "../../index";

interface FontProps {
  fonts: {
    label: string;
    value: string;
    fontName: string;
  }[];
  textProps: textProps;

  setTextProps: Dispatch<SetStateAction<textProps>>;

  modalMode: modalModeProps;

  setModalMode: Dispatch<SetStateAction<modalModeProps>>;
}

const FontWrapper = ({
  fonts,
  textProps,
  modalMode,
  setTextProps,
  setModalMode,
}: FontProps) => {
  return (
    <div className="w-[60%] max-[940px]:w-full h-full flex flex-col absolute z-10 left-1">
      <div className="w-full h-[60px] text-white bg-black flex justify-center items-center">
        <button
          onClick={() => setModalMode({ ...modalMode, font: !modalMode.font })}
          className="absolute left-[6%]"
        >
          <ArrowLeft size={40} />
        </button>
        <h2 className="text-2xl text-center">Fontes</h2>
      </div>
      <ul className="w-full h-[90%]  bg-black overflow-y-auto flex flex-col gap-2 p-4">
        {fonts.map((font) => (
          <li
            key={font.value}
            onClick={() => {
              setTextProps({ ...textProps, fontFamily: font.label });
              setModalMode({ ...modalMode, font: !modalMode.font });
            }}
            className="w-full h-[80px] flex justify-center border border-s-white rounded-md cursor-pointer text-white"
          >
            <p
              style={{
                fontFamily: `${font.label}`,
                fontSize: "clamp(1.5rem, 1vw + 1rem, 1rem)",
              }}
            >
              {font.fontName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FontWrapper;
