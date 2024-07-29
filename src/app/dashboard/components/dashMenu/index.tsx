"use client";
import { Heart, Home, UploadIcon, User, UserCog } from "lucide-react";
import CategoryModal from "../categoryModal";
import { useDisclosure } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useUSer } from "@/hooks";
import FavoriteModal from "../favoriteModal";

const DashMenu = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setMode, user } = useUSer();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) {
    return <></>;
  }

  let mode = "category";
  if (pathname === "/dashboard") {
    mode = "category";
  } else if (pathname === "/dashboard/profile") {
    mode = "profile";
  } else if (
    pathname.startsWith("/dashboard/") &&
    pathname.split("/").length === 3
  ) {
    mode = "subCategory";
  } else if (
    pathname.startsWith("/dashboard/") &&
    pathname.split("/").length === 4
  ) {
    mode = "sticker";
  }

  return (
    <>
      {pathname === "/login" || pathname === "/" ? (
        <></>
      ) : (
        <div className="w-full p-2 absolute bottom-[0%]  h-[46px]  bottom-[0%] z-[99999] flex text-white justify-center bg-black rounded-md  p-2">
          <div className="flex gap-2 w-[80%] justify-between">
            <Home
              className="cursor-pointer"
              onClick={() => router.push("/dashboard")}
              size={30}
            />

            {user.is_admin ? (
              <></>
            ) : (
              <Heart
                onClick={() => {
                  onOpen();
                }}
                className="cursor-pointer"
                size={30}
              />
            )}

            {user.is_admin ? (
              <>
                <UserCog
                  className="cursor-pointer"
                  onClick={() => {
                    onOpen(), setMode(mode);
                  }}
                  size={30}
                />
              </>
            ) : (
              <></>
            )}

            <User
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer"
              size={30}
            />
          </div>

          {user.is_admin ? (
            <CategoryModal isOpen={isOpen} onClose={onClose} />
          ) : (
            <></>
          )}

          {user.is_admin === false ? (
            <FavoriteModal isOpen={isOpen} onClose={onClose} />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default DashMenu;
