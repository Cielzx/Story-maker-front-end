import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Layer,
  Transformer,
  Text,
  TextPath,
  Group,
  Image as Img,
} from "react-konva";
import Konva from "konva";
import { modalModeProps, textProps } from "../UserStickerModal";
import { useSticker, useUSer } from "@/hooks";
import { Cloudinary } from "cloudinary-core";
import { useTimeout } from "react-use";
import { KonvaEventObject } from "konva/lib/Node";

interface konvasProps {
  currentText: string;
  setCurrentText: React.Dispatch<React.SetStateAction<string>>;
  textProps: textProps;
  texts: textProps[];
  setTexts: React.Dispatch<React.SetStateAction<textProps[]>>;
  nextId: number;
  setNextId: React.Dispatch<React.SetStateAction<number>>;
  setModalMode: Dispatch<SetStateAction<modalModeProps>>;
  modalMode: modalModeProps;
  setTextProps: Dispatch<SetStateAction<textProps>>;
}

const StickerCanvas = ({
  textProps,
  nextId,
  texts,
  setTexts,
  setNextId,
  modalMode,
  setModalMode,
  currentText,
  setCurrentText,
}: konvasProps) => {
  const { createUserSticker } = useSticker();
  const { user, getUser } = useUSer();
  const stageRef = useRef<Konva.Stage>(null);

  const textRef = useRef<Konva.Text>(null);

  const [format, setFormat] = useState(false);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [images, setImages] = useState<
    { id: number; image: HTMLImageElement }[]
  >([]);

  const cloudinary = new Cloudinary({ cloud_name: "dpv8s8uvd" });
  const imgUrl = cloudinary.url(textProps.image, {
    secure: true, // Gera um link seguro (https)
    crossorigin: "anonymous", // Para evitar problemas com CORS
  });

  const loadImage = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    img.onload = () => {
      setImages((prevImages) => [
        ...prevImages,
        { id: Date.now(), image: img },
      ]);
    };
  };

  const handleDblClick = (id: number) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

  useEffect(() => {
    const handleResize = () => {
      if (stageRef.current) {
        const parent = stageRef.current.container().parentNode as HTMLElement;
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTransform = () => {
    const node = textRef.current;
    const scaleX = node!.scaleX();
    const scaleY = node!.scaleY();

    node!.scaleX(1);
    node!.scaleY(1);

    node!.width(node!.width() * scaleX);
    node!.height(node!.height() * scaleY);
  };

  function dataURLToFile(dataURL: string, fileName: string): File {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  async function userSticker(imgMode: string) {
    if (stageRef.current) {
      try {
        const dataURL = stageRef.current.toDataURL({
          mimeType: "image/svg+xml",
        });

        const file = dataURLToFile(dataURL, "sticker.png");

        createUserSticker(imgMode, file);

        getUser();
        return file;
      } catch (error) {
        console.error("Erro ao gerar o sticker:", error);
        return null;
      }
    }
  }

  const removeText = (id: number) => {
    setTexts(texts.filter((t) => t.id !== id));
  };

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
      },
    ]);
    setNextId(nextId + 1);
    setCurrentText("");
    setModalMode({ ...modalMode, text: !modalMode.text });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddText();
    }
  };

  const lastTap = useRef<number>(0);

  const handleTouchEnd = (e: KonvaEventObject<TouchEvent>, id: number) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap.current;

    if (tapLength < 300 && tapLength > 0) {
      handleDblClick(id);
    }

    lastTap.current = currentTime;
  };

  useEffect(() => {
    loadImage();
  }, [textProps.image]);

  return (
    <div
      className="w-full h-[90%] relative"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/vetores-premium/padrao-quadrado-cinza-sem-costura-textura-transparente-quadriculada_53562-19403.jpg)",
        backgroundSize: "100% 100%",
      }}
    >
      {modalMode.text ? (
        <div className="w-full h-full absolute bg-[rgba(0,0,0,0.6)] flex justify-center items-center z-10">
          <input
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o texto aqui"
            className="input-style bg-transparent w-[85%] p-2 mb-4 text-white font-extrabold"
          />
        </div>
      ) : (
        <></>
      )}

      {format && (
        <div className="w-full h-full absolute bg-[rgba(0,0,0,0.6)] flex flex-col gap-4 text-white z-[9] justify-center items-center p-2">
          <h2>Escolha o formato da sua figurinha :)</h2>
          <div className="w-full flex">
            <div className="w-[50%] flex justify-center items-center">
              <button
                onClick={() => {
                  userSticker("png");
                  setTimeout(() => {
                    setFormat(!format);
                  }, 3000);
                }}
                className="btn-form"
              >
                PNG
              </button>
            </div>
            <div className="w-[50%] flex justify-center items-center">
              <button
                onClick={() => {
                  userSticker("");
                  setTimeout(() => {
                    setFormat(!format);
                  }, 4000);
                }}
                className="btn-form"
              >
                SVG
              </button>
            </div>
          </div>
        </div>
      )}

      <Stage
        className="flex justify-center items-center  text-center z-8"
        width={dimensions.width}
        height={dimensions.height}
        ref={stageRef}
      >
        <Layer className="flex justify-center items-center">
          {texts.map((text) => (
            <Group key={text.id} x={150} y={100} draggable>
              <Text
                id={`text-${text.id}`}
                x={-100}
                y={10 + text.id * 10}
                text={text.text}
                fontSize={textProps.fontSize}
                fontFamily={textProps.fontFamily}
                fill={textProps.fill}
                opacity={textProps.opacity}
                letterSpacing={textProps.letterSpacing}
                filters={[Konva.Filters.Blur]}
                stroke="black"
                strokeWidth={textProps.strokeWidth}
                align="center"
                draggable
                onTransformEnd={handleTransform}
                onDblClick={() => removeText(text.id)}
              />
            </Group>
          ))}

          {images.map((img) => (
            <Group key={img.id} x={150} y={100} draggable>
              <Img
                key={img.id}
                image={img.image}
                width={100}
                height={100}
                x={50}
                y={50}
                draggable
                onDblClick={() => handleDblClick(img.id)}
                onTouchEnd={(e) => handleTouchEnd(e, img.id)}
              />
            </Group>
          ))}
        </Layer>
      </Stage>

      <div className="w-full h-[50px] absolute bottom-0 bg-[rgba(0,0,0,0.4)] rounded-md flex justify-center items-center text-white z-[9]">
        <button onClick={() => setFormat(!format)} className="btn-form">
          {format ? "Fechar" : "Criar figurinha"}
        </button>
      </div>
    </div>
  );
};

export default StickerCanvas;
