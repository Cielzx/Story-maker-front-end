"use client";
import {
  Home,
  UploadIcon,
  CircleUserRound,
  MonitorCog,
  CirclePlus,
  Sticker,
} from "lucide-react";
import CategoryModal from "../categoryModal";
import { useDisclosure } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useUSer } from "@/hooks";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import UserStickerModal from "../UserStickerModal";

const DashMenu = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setMode, user, mode } = useUSer();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalSticker, setModalSticker] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  let pageMode = "";
  useEffect(() => {
    if (pathname === "/dashboard") {
      pageMode = "category";
    } else if (pathname === "/dashboard/profile") {
      pageMode = "profile";
    } else if (
      pathname.startsWith("/dashboard/") &&
      pathname.split("/").length === 3
    ) {
      pageMode = "subCategory";
    } else if (
      pathname.startsWith("/dashboard/") &&
      pathname.split("/").length === 4
    ) {
      pageMode = "sticker";
    }
  }, [pathname, mode]);

  const openModal = (modalName: string) => {
    setActiveModal(modalName); // Define o modal ativo
    onOpen(); // Abre o modal
  };

  const closeModal = () => {
    setActiveModal(null); // Reseta o modal ativo quando fechado
    onClose();
  };

  if (!user) {
    return <></>;
  }

  return (
    <>
      {pathname === "/login" || pathname === "/" ? (
        <></>
      ) : (
        <div className="w-full block">
          <div className="w-full  p-2 absolute bottom-[0%] min-[940px]:left-[0%]  h-[46px] z-[10] flex text-white justify-center bg-black   p-2">
            <div className="flex gap-2 max-[940px]:w-[80%] max-[1900px]:w-[40%] justify-between">
              <Home
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
                size={30}
              />

              <Heart
                onClick={() => {
                  router.push("/dashboard/favorites");
                }}
                className="cursor-pointer"
                size={30}
              />

              <CirclePlus
                className="cursor-pointer relative bottom-2"
                onClick={() => {
                  openModal("UserStickerModal");
                }}
                size={50}
                color="black"
                fill="white"
              />

              <Sticker
                onClick={() => {
                  router.push("/dashboard/user-stickers");
                }}
                className="cursor-pointer"
                size={30}
              />

              {user.is_admin &&
              pathname !== "/dashboard/profile" &&
              pathname !== "/dashboard/favorites" &&
              pathname !== "/dashboard/user-stickers" ? (
                <>
                  <MonitorCog
                    className="cursor-pointer"
                    onClick={() => {
                      setMode(pageMode);
                      openModal("UserAdmModal");
                    }}
                    size={30}
                  />
                </>
              ) : (
                <></>
              )}

              <CircleUserRound
                onClick={() => router.push("/dashboard/profile")}
                className="cursor-pointer "
                size={30}
              />
            </div>

            {activeModal === "UserAdmModal" && (
              <CategoryModal isOpen={!!activeModal} onClose={closeModal} />
            )}

            {activeModal === "UserStickerModal" && (
              <UserStickerModal
                isOpen={!!activeModal}
                onClose={closeModal}
                modalSticker={modalSticker}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashMenu;
