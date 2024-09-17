import Input from "@/app/components/Input";
import CustomModal from "@/app/components/Modal";
import Toast from "@/app/components/Toast";
import { iSubCategories } from "@/context/categoryContext";
import { useCategory, useSticker, useUSer } from "@/hooks";
import { CategoryData, CombineCategorySchema } from "@/schemas/category.schema";
import { StickerData, StickerSchema } from "@/schemas/sticker.schema";
import { Image, Sticker, Target } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, UseFormRegister } from "react-hook-form";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

const CategoryModal = ({ isOpen, onClose, id }: modalProps) => {
  const { setCoverImage, createCategory, createSubCategorie, updateCategory } =
    useCategory();
  const { setFigureImage, createSticker, uploadStickerFile } = useSticker();
  const { user, updateUser } = useUSer();
  const { mode } = useUSer();
  const [multi, setMulti] = useState(false);
  const [filesPaste, setFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombineCategorySchema>();
  const [preview, SetPreview] = useState<string | ArrayBuffer | null>();
  const [imgMode, setImgMode] = useState("");
  const pathname = usePathname();
  const pathWithoutLeadingSlash = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;
  const pathParts = pathWithoutLeadingSlash.split("/");

  const onDrop = useCallback(
    (files: File[]) => {
      if (mode === "sticker") {
        files.forEach(async (file, index: number) => {
          setTimeout(() => {
            if (imgMode !== "") {
              createSticker(imgMode, files[index] || filesPaste[index]);
            } else {
              Toast({
                message: "Selecione o formato da imagem SVG OU PNG",
                isSucess: false,
              });
            }
          }, 1000);

          // setFigureImage(files[index]);
        });
      }

      const file = new FileReader();

      file.onload = () => {
        SetPreview(file.result);
      };

      file.readAsDataURL(files[0]);
      setCoverImage(files[0]);
    },
    [imgMode]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: multi,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".heif", ".heic"],
    },
  });

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardItems = event.clipboardData.items;
    const pastedFiles: File[] = [];

    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          pastedFiles.push(file);
        }
      }
    }

    pastedFiles.forEach(async (pasteFile, index: number) => {
      setTimeout(() => {
        if (imgMode !== "") {
          createSticker(imgMode, pastedFiles[index]);
        } else {
          Toast({
            message: "Selecione o formato da imagem SVG OU PNG",
            isSucess: false,
          });
        }
      }, 1000);
    });

    const file = new FileReader();

    file.onload = () => {
      SetPreview(file.result);
    };

    file.readAsDataURL(pastedFiles[0]);
    setFigureImage(pastedFiles[0]);
    setCoverImage(pastedFiles[0]);
    if (pastedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...pastedFiles]);
    }
  };

  let headerName = "";
  if (mode === "category") {
    headerName = "Criar categoria";
  } else if (mode === "subCategory") {
    headerName = "Criar Sub-categoria";
  } else if (mode === "sticker") {
    headerName = "Criar figurinha";
  } else if (mode === "update") {
    headerName = "Atualizar categoria";
  }

  let fieldValue: keyof CombineCategorySchema = "category_name";
  let label = "";
  if (mode === "category" || mode === "update") {
    fieldValue = "category_name";
    label = "Nome da categoria";
  } else if (mode === "subCategory") {
    fieldValue = "item_name";
    label = "Nome da sub-categoria";
  } else if (mode === "sticker") {
    fieldValue = "figure_name";
    label = "Nome da figurinha";
  } else if (mode === "profile") {
    fieldValue = "name";
    label = "Editar nome";
  }

  const onSub = async (data: CombineCategorySchema) => {
    if (mode === "category") {
      createCategory(data);
    } else if (mode === "subCategory") {
      createSubCategorie(data);
    } else if (mode === "sticker") {
      createSticker(imgMode);
    } else if (mode === "profile") {
      updateUser(user!.id, data);
    } else if (mode === "update") {
      updateCategory(data, id!);
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  useEffect(() => {
    setMulti(true);
  }, []);

  return (
    <CustomModal
      isOpen={isOpen}
      headerText={headerName}
      onClose={onClose}
      MaxWidthBody="80%"
      MaxWidthHeader="100%"
      widthBody="100%"
      widthHeader="100%"
      heightBody=""
    >
      <form
        onSubmit={handleSubmit(onSub)}
        className="flex flex-col w-[100%] h-full justify-center items-center gap-2 border-red-300 border-1 border-solid text-white"
      >
        {mode === "sticker" ? (
          <></>
        ) : (
          <Input
            type="text"
            id={fieldValue}
            label={label}
            {...register(fieldValue)}
          />
        )}

        {mode === "profile" ? (
          <></>
        ) : (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
            style={{
              border: "2px dashed #ccc",
              borderRadius: "4px",
              height: "100px",
              padding: "2px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Solte a imagem aqui ...</p>
            ) : (
              <div
                onPaste={onPaste}
                className="w-full flex flex-col items-center h-full justify-center text-white font-extrabold text-[15px] p-2"
                style={{
                  backgroundImage: `url(${preview})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <p>Arraste uma imagem aqui ou clique para selecionar</p>
                <Image size={30} />
              </div>
            )}
          </div>
        )}

        {mode === "sticker" ? (
          <>
            <div className="w-full h-[40px] flex items-center justify-center gap-2">
              <button
                onClick={() => setImgMode("svg")}
                type="button"
                className="w-[100px]  h-full text-white font-extrabold border border-1 border-s-white"
              >
                SVG
              </button>
              <button
                onClick={() => setImgMode("png")}
                type="button"
                className="w-[100px] h-full text-white font-extrabold border border-1 border-s-white"
              >
                PNG
              </button>
            </div>
          </>
        ) : (
          <></>
        )}

        {mode === "sticker" ? (
          <></>
        ) : (
          <button type="submit" className="btn-form">
            Criar
          </button>
        )}
      </form>
    </CustomModal>
  );
};

export default CategoryModal;
