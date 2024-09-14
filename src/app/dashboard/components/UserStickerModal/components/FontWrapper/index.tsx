import { ArrowLeft, FileType, Image } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { modalModeProps, textProps } from "../../index";
import { useDropzone } from "react-dropzone";
import api from "@/services/api";
import Toast from "@/app/components/Toast";
import { useUSer } from "@/hooks";
import { useForm } from "react-hook-form";
import Input from "@/app/components/Input";

interface FontProps {
  textProps: textProps;

  setTextProps: Dispatch<SetStateAction<textProps>>;

  modalMode: modalModeProps;

  setModalMode: Dispatch<SetStateAction<modalModeProps>>;
}

const FontWrapper = ({
  textProps,
  modalMode,
  setTextProps,
  setModalMode,
}: FontProps) => {
  const [file, setFile] = useState<File[]>();
  const [drop, setShowDrop] = useState(false);
  const { createFont, fetchFonts, user, fonts } = useUSer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const onDrop = useCallback((file: File[]) => {
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "font/ttf": [".ttf"],
      "font/otf": [".otf"],
      "font/woff": [".woff"],
      "font/woff2": [".woff2"],
    },
  });

  const onSub = async (data: { name: string }) => {
    createFont(file![0], data.name);
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  if (!user) {
    return "";
  }
  return (
    <div className="w-full max-[940px]:w-full h-full flex flex-col absolute z-10 left-1 ">
      <div className="w-full h-[60px] text-white bg-black flex justify-center items-center relative">
        <button
          onClick={() => setModalMode({ ...modalMode, font: !modalMode.font })}
          className="absolute left-[6%]"
        >
          <ArrowLeft size={40} />
        </button>
        <h2 className="text-2xl text-center">Fontes</h2>

        {user.is_admin && (
          <button
            onClick={() => setShowDrop(!drop)}
            className="btn-form w-[25%] h-[40px] z-10 text-white text-base flex justify-center items-center absolute right-[6%]"
          >
            {drop ? "Fechar" : "Adicionar"}
          </button>
        )}
      </div>

      {drop && (
        <div className="w-full h-full absolute flex items-center">
          <form
            onSubmit={handleSubmit(onSub)}
            className="w-full h-full  bg-[rgba(0,0,0,0.8)] text-white flex gap-2 flex-col justify-center items-center p-2"
          >
            <Input
              label="Nome da fonte"
              id="name"
              type="text"
              {...register("name")}
            />
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

                bottom: "50%",
                zIndex: "10",
                background: "black",
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Solte a fonte aqui ...</p>
              ) : (
                <div className="w-full flex flex-col items-center h-full justify-center text-white font-extrabold text-[15px] p-2">
                  <p>Arraste uma fonte aqui ou clique para selecionar</p>
                  <FileType size={30} />
                </div>
              )}
            </div>

            <button type="submit" className="btn-form">
              Adicionar fonte
            </button>
          </form>
        </div>
      )}

      <ul className="w-full h-[90%]  bg-black overflow-y-auto flex flex-col gap-2 p-4">
        {fonts.map((font) => (
          <li
            key={font.id}
            onClick={() => {
              setTextProps({ ...textProps, fontFamily: font.name });
              setModalMode({ ...modalMode, font: !modalMode.font });
            }}
            className="w-full h-[80px] flex justify-center border border-s-white rounded-md cursor-pointer text-white"
          >
            <p
              className="flex items-center"
              style={{
                fontFamily: `${font.name}`,
                fontSize: "clamp(2rem, 1vw + 1rem, 1rem)",
              }}
            >
              {font.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FontWrapper;
