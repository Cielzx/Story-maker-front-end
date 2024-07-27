import Input from "@/app/components/Input";
import CustomModal from "@/app/components/Modal";
import { iSubCategories } from "@/context/categoryContext";
import { useCategory, useSticker, useUSer } from "@/hooks";
import { CategoryData, CombineCategorySchema } from "@/schemas/category.schema";
import { StickerData, StickerSchema } from "@/schemas/sticker.schema";
import { Image, Sticker } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, UseFormRegister } from "react-hook-form";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryModal = ({ isOpen, onClose }: modalProps) => {
  const { setCoverImage, createCategory, createSubCategorie } = useCategory();
  const { setFigureImage, createSticker } = useSticker();
  const { user, updateUser } = useUSer();
  const { mode, setMode } = useUSer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombineCategorySchema>();
  const pathname = usePathname();

  const onDrop = useCallback((files: File[]) => {
    if (
      pathname.startsWith("/dashboard/") &&
      pathname.split("/").length === 4
    ) {
      setFigureImage(files[0]);
    }
    setCoverImage(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": ["jpg"], "image/png": ["png"] },
  });
  let headerName = "";
  if (mode === "category") {
    headerName = "Criar categoria";
  } else if (mode === "subCategory") {
    headerName = "Criar Sub-categoria";
  } else if (mode === "sticker") {
    headerName = "Criar figurinha";
  }

  let fieldValue: keyof CombineCategorySchema = "category_name";
  let label = "";
  if (mode === "category") {
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
      createSticker(data);
    } else if (mode === "profile") {
      updateUser(user!.id, data);
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
        <Input
          type="text"
          id={fieldValue}
          label={label}
          {...register(fieldValue)}
        />

        {mode === "profile" ? (
          <></>
        ) : (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
            style={{
              border: "2px dashed #ccc",
              borderRadius: "4px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Solte a imagem aqui ...</p>
            ) : (
              <div className="w-full flex flex-col items-center">
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
