import {
  FlipHorizontal2,
  Heart,
  Icon,
  Image,
  ListPlus,
  StarIcon,
  TypeOutline,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FaFont } from "react-icons/fa";
import { ImFontSize } from "react-icons/im";
import { MdOpacity } from "react-icons/md";
import { modalModeProps, textProps } from "../..";

interface ButtonProps {
  currentText: string;
  setTexts: React.Dispatch<React.SetStateAction<textProps[]>>;
  texts: textProps[];
  textProps: textProps;
  nextId: number;
  setNextId: React.Dispatch<React.SetStateAction<number>>;
  modalMode: modalModeProps;
  setCurrentText: React.Dispatch<React.SetStateAction<string>>;

  setModalMode: Dispatch<SetStateAction<modalModeProps>>;
}

const ActionButton = ({
  setModalMode,
  modalMode,
  setTexts,
  texts,
  textProps,
  nextId,
  setNextId,
  currentText,
  setCurrentText,
}: ButtonProps) => {
  const handleAddText = () => {
    setTexts([
      ...texts,
      {
        id: nextId,
        text: currentText,
        fontSize: 24,
        fontFamily: "Arial",
        fill: "black",
        opacity: 1,
        letterSpacing: 0,
        strokeWidth: 0,
        image: "",

        iconHeight: 50,
      },
    ]);
    setNextId(nextId + 1);
    setCurrentText("");
    setModalMode({ ...modalMode, text: !modalMode.text });
  };

  const buttonActions = [
    {
      label: "Adicionar",
      onClick: () => {
        handleAddText();
      },

      icon: <ListPlus size={25} />,
    },

    {
      label: "Fonte",
      onClick: () => setModalMode({ ...modalMode, font: !modalMode.font }),
      icon: <FaFont size={25} />,
    },
    {
      label: "Tamanho",
      onClick: () =>
        setModalMode({
          ...modalMode,
          fontSize: !modalMode.fontSize,
        }),
      icon: <ImFontSize size={25} />,
    },
    ...(textProps.image
      ? [
          {
            label: "Tamanho do icone",
            onClick: () =>
              setModalMode({
                ...modalMode,
                iconHeight: !modalMode.iconHeight,
              }),
            icon: <Image size={25} />,
          },
        ]
      : []),

    {
      label: "Opacidade",
      onClick: () =>
        setModalMode({
          ...modalMode,
          opacity: !modalMode.opacity,
        }),
      icon: <MdOpacity size={25} />,
    },
    {
      label: "Icones",
      onClick: () =>
        setModalMode({
          ...modalMode,
          icon: !modalMode.icon,
        }),
      icon: <StarIcon size={25} />,
    },
    {
      label: "Espaço",
      onClick: () =>
        setModalMode({
          ...modalMode,
          letterSpacing: !modalMode.letterSpacing,
        }),
      icon: <FlipHorizontal2 size={25} />,
    },
    {
      label: "Cor",
      onClick: () =>
        setModalMode({
          ...modalMode,
          fill: !modalMode.fill,
        }),
      icon: (
        <img
          src="https://images2.imgbox.com/ef/4e/BzXeOtCi_o.png"
          className="w-full h-[25px]"
          alt=""
        />
      ),
    },
    {
      label: "Contorno",
      onClick: () =>
        setModalMode({
          ...modalMode,
          strokeWidth: !modalMode.strokeWidth,
        }),
      icon: <TypeOutline size={25} />,
    },
    // Adicione mais funcionalidades conforme necessário
  ];
  return (
    <div className="w-[500px] h-full flex gap-2 relative overflow-x-auto cursor-pointer">
      {buttonActions.map((action, index) => (
        <div
          className="w-full h-[90%] flex flex-col justify-center items-center gap-1"
          key={index}
          onClick={action.onClick}
        >
          <p style={{ fontSize: "clamp(1.5rem, 1vw + 1rem, 1rem)" }}>
            {action.icon}
          </p>

          <div className="w-[60px] flex justify-center overflow-hidden relative">
            <p
              className={`whitespace-nowrap ${
                action.label.length > 10 ? "scrolling-text" : ""
              }`}
              style={{ fontSize: "clamp(0.5rem, 1vw + 0.5rem, 1rem)" }}
            >
              {action.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionButton;
