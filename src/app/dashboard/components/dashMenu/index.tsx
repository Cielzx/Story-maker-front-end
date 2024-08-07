"use client";
import { Home, UploadIcon, CircleUserRound, MonitorCog } from "lucide-react";
import CategoryModal from "../categoryModal";
import { useDisclosure } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useUSer } from "@/hooks";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";

const DashMenu = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setMode, user, mode } = useUSer();
  const pathname = usePathname();
  const router = useRouter();
  let pageMode = "";
  useEffect(() => {
    if (mode == "") {
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
    }
  }, [pathname, mode]);

  if (!user) {
    return <></>;
  }

  return (
    <>
      {pathname === "/login" || pathname === "/" ? (
        <></>
      ) : (
        <div className="w-full p-2 absolute bottom-[0%] min-[940px]:left-[0%]  h-[46px] z-[10] flex text-white justify-center bg-black rounded-md  p-2">
          <div className="flex gap-2 w-[80%] justify-between">
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

            {user.is_admin ? (
              <>
                <MonitorCog
                  className="cursor-pointer"
                  onClick={() => {
                    onOpen(), setMode(pageMode);
                  }}
                  size={30}
                />
              </>
            ) : (
              <></>
            )}

            <CircleUserRound
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
        </div>
      )}
    </>
  );
};

export default DashMenu;
