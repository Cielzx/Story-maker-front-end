import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import { useSticker, useUSer } from "@/hooks";
import { ArrowLeft, Image, Plus, Trash } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { modalModeProps, textProps } from "../..";

import { useForm, UseFormRegister } from "react-hook-form";

interface IconProps {
  textProps: textProps;

  setTextProps: Dispatch<SetStateAction<textProps>>;

  modalMode: modalModeProps;

  setModalMode: Dispatch<SetStateAction<modalModeProps>>;

  images: {
    id: number;
    image: HTMLImageElement;
    removed: boolean;
  }[];

  setImages: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        image: HTMLImageElement;
        removed: boolean;
      }[]
    >
  >;
}

const IconWrapper = ({
  modalMode,
  setModalMode,
  textProps,
  setTextProps,
  images,
  setImages,
}: IconProps) => {
  const { icons, createIcon, getIcons, deleteIcon } = useSticker();
  const { user } = useUSer();
  const [drop, setShowDrop] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    files.forEach(async (file, index: number) => {
      setTimeout(() => {
        if (file.name.includes("png")) {
          createIcon(files[index]);
        } else {
          Toast({
            message: "Selecione o formato da imagem SVG OU PNG",
            isSucess: false,
          });
        }
      }, 1000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".heif", ".heic"],
    },
  });

  useEffect(() => {
    getIcons();
  }, []);

  const handleIconSelect = () => {
    let id = 0;

    const index = images.findIndex((img) => img.removed === false);

    if (index !== -1) {
      id = images[index].id;

      setImages((prevImages) =>
        prevImages.map((img, idx) =>
          idx === index ? { ...img, removed: false } : img
        )
      );
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="w-[60%] bg-black text-white max-[940px]:w-full h-full flex flex-col absolute z-10 top-[5%] max-[940px]:top-[1%] max-[940px]:left-[1%] p-2">
      <div className="w-full h-[80px] flex justify-center items-center relative">
        <button
          onClick={() => setModalMode({ ...modalMode, icon: !modalMode.icon })}
          className="w-[20%] absolute left-[6%]"
        >
          <ArrowLeft size={40} />
        </button>
        <h2 className="text-2xl">Icones</h2>

        {user.is_admin && (
          <button
            onClick={() => setShowDrop(!drop)}
            className="btn-form w-[25%] h-[40px] text-white text-base flex justify-center items-center absolute right-[6%]"
          >
            {drop ? "Fechar" : "Adicionar"}
          </button>
        )}
      </div>

      {drop && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
          style={{
            width: "97%",
            border: "2px dashed #ccc",
            borderRadius: "4px",
            height: "100px",
            padding: "2px",
            textAlign: "center",
            cursor: "pointer",
            position: "absolute",
            bottom: "50%",
            zIndex: "10",
            background: "black",
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte a imagem aqui ...</p>
          ) : (
            <div className="w-full flex flex-col items-center h-full justify-center text-white font-extrabold text-[15px] p-2">
              <p>Arraste uma imagem aqui ou clique para selecionar</p>
              <Image size={30} />
            </div>
          )}
        </div>
      )}

      <ul className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 ">
        {icons &&
          icons.map((icon) => (
            <div
              key={icon.id}
              onClick={() => {
                setTextProps({ ...textProps, image: icon.icon_image });
                handleIconSelect();
                setModalMode({ ...modalMode, icon: !modalMode.icon });
              }}
              className="w-[80%] h-[130px] relative group"
            >
              {user.is_admin ? (
                <div className="w-ful h-[20px] z-10  absolute hidden group-hover:flex right-0">
                  <Trash onClick={() => deleteIcon(icon.id)} color="white" />
                </div>
              ) : (
                <></>
              )}

              <img
                src={icon.icon_image}
                className="w-full h-full object-cover"
                alt="icone"
              />
            </div>
          ))}
      </ul>
    </div>
  );
};

export default IconWrapper;
