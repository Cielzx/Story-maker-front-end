"use client";
import { Heart, Home, UploadIcon, User } from "lucide-react";
import CategoryModal from "../categoryModal";
import { useDisclosure } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useUSer } from "@/hooks";

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
    <div
      suppressHydrationWarning
      className="w-full p-2  h-[46px]  bottom-[0%] z-[99999] flex text-white justify-center bg-black rounded-md  p-2"
    >
      <div className="flex gap-2 w-[80%] justify-between">
        <Home
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
          size={30}
        />

        <Heart className="cursor-pointer" size={30} />

        <UploadIcon
          className="cursor-pointer"
          onClick={() => {
            onOpen(), setMode(mode);
          }}
          size={30}
        />

        <User className="cursor-pointer" size={30} />
      </div>

      <CategoryModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default DashMenu;
