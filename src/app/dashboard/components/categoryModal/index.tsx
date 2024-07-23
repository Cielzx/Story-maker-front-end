import Input from "@/app/components/Input";
import CustomModal from "@/app/components/Modal";
import { useCategory } from "@/hooks";
import { Image, Sticker } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
}
const CategoryModal = ({ isOpen, onClose }: modalProps) => {
  const { setCoverImage } = useCategory();

  const onDrop = useCallback((files: File[]) => {
    setCoverImage(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
  });

  return (
    <CustomModal
      isOpen={isOpen}
      headerText="Criar categoria"
      onClose={onClose}
      MaxWidthBody="80%"
      MaxWidthHeader="100%"
      widthBody="100%"
      widthHeader="100%"
      heightBody=""
    >
      <div className="flex flex-col w-[100%] h-full justify-center items-center gap-2 border-red-300 border-1 border-solid text-white">
        <Input
          type="text"
          id="category_name"
          name="category_name"
          label="Nome da categoria"
        />

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
        <button className="btn-form">Criar</button>
      </div>
    </CustomModal>
  );
};

export default CategoryModal;
