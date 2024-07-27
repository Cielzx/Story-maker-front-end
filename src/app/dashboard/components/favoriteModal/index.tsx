import CustomModal from "@/app/components/Modal";
import { useUSer } from "@/hooks";
import ReusableList from "../Lists/ReusableList";
import { useEffect } from "react";
import FavoriteList from "./FavoriteList";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteModal = ({ isOpen, onClose }: modalProps) => {
  const { user, getUser } = useUSer();

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return "ERRRRRO";
  }
  return (
    <CustomModal
      isOpen={isOpen}
      headerText="Favoritos"
      onClose={onClose}
      MaxWidthBody="80%"
      MaxWidthHeader="100%"
      widthBody="100%"
      widthHeader="100%"
      heightBody="320px"
    >
      <div className="w-full bg-black">
        <FavoriteList items={user.favorites} />
      </div>
    </CustomModal>
  );
};

export default FavoriteModal;
