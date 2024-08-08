import Input from "@/app/components/Input";
import CustomModal from "@/app/components/Modal";
import { iSubCategories } from "@/context/categoryContext";
import { useCategory, useSticker, useUSer } from "@/hooks";
import { CategoryData, CombineCategorySchema } from "@/schemas/category.schema";
import { StickerData, StickerSchema } from "@/schemas/sticker.schema";
import { Image, Sticker, Target } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, UseFormRegister } from "react-hook-form";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

const CategoryModal = ({ isOpen, onClose, id }: modalProps) => {
  const {
    setCoverImage,
    createCategory,
    createSubCategorie,
    coverImage,
    updateCategory,
    category,
  } = useCategory();
  const { setFigureImage, createSticker } = useSticker();
  const { user, updateUser } = useUSer();
  const { mode, setMode } = useUSer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombineCategorySchema>();
  const [preview, SetPreview] = useState<string | ArrayBuffer | null>();
  const pathname = usePathname();

  const onDrop = useCallback((files: File[]) => {
    if (
      pathname.startsWith("/dashboard/") &&
      pathname.split("/").length === 4
    ) {
      setFigureImage(files[0]);
    }

    const file = new FileReader();

    file.onload = () => {
      SetPreview(file.result);
    };

    file.readAsDataURL(files[0]);
    setCoverImage(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".heif", ".heic"],
    },
  });

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

  const onSub = (data: CombineCategorySchema) => {
    if (mode === "category") {
      createCategory(data);
    } else if (mode === "subCategory") {
      createSubCategorie(data);
    } else if (mode === "sticker") {
      createSticker();
    } else if (mode === "profile") {
      updateUser(user!.id, data);
    } else if (mode === "update") {
      updateCategory(data, id!);
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

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

        <button type="submit" className="btn-form">
          Criar
        </button>
      </form>
    </CustomModal>
  );
};

export default CategoryModal;
