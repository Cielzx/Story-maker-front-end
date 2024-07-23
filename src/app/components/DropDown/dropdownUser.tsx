import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  position,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext, AuthProvider } from "@/context/authContext";
import { Heart, LogOut, User } from "lucide-react";
// import { useUser } from "@/hooks";

const DropDown = () => {
  const router = useRouter();
  // const { user } = useUser();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const pathname = usePathname();

  const handleLogout = () => {
    destroyCookie(null, "user.Token");
    return router.push("/login");
  };

  // if (!user) {
  //   return <></>;
  // }
  const user = "Lorena";
  let initials = "";
  const names = user.split(" ");

  if (names && names.length > 0) {
    const firstName = names[0];
    initials += firstName.charAt(0).toUpperCase();
  }

  if (names && names?.length > 1) {
    const lastName = names[names.length - 1];
    initials += lastName.charAt(0).toUpperCase();
  }
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <div className="w-[10%] flex items-center justify-center max-[920px]:w-[16%] z-[1]">
        <Menu>
          <>
            <MenuButton as={Button}>
              <div className="w-full h-full flex gap-3   items-center">
                <div className="w-16 h-16 bg-pink-400 text-4xl  rounded-full bg-gray-900 max-[920px]:w-14 max-[920px]:h-14">
                  {/* { {user.profile_image ? (
                    <img
                      src=""
                      className="rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <p className="w-full h-full flex justify-center items-center  text-white">
                      {initials}
                    </p>
                  )} } */}
                  <p className="w-full h-full flex justify-center items-center  text-white">
                    {initials}
                  </p>
                </div>
              </div>
            </MenuButton>
            <MenuList
              className="font-bold shadow-xl transform translate-y-4"
              style={{
                background: "black",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                borderRadius: "10%",
                width: "140px",
                marginTop: "4px",
                // paddingLeft: "40px",
                // paddingRight: "40px",
                position: "relative",
                right: "14%",
              }}
            >
              <div className="flex w-[100%] flex-col gap-2">
                <>
                  <div className="w-full flex flex-col gap-1 ">
                    {pathname == "/profile" ? (
                      <></>
                    ) : (
                      <button
                        onClick={() => router.push("/profile")}
                        className="btn-dropDown"
                      >
                        <User size={30} /> Meu perfil
                      </button>
                    )}

                    <button
                      onClick={() => handleLogout()}
                      className="btn-dropDown"
                    >
                      <Heart size={30} /> Favoritos
                    </button>

                    <button
                      onClick={() => handleLogout()}
                      className="btn-dropDown"
                    >
                      <LogOut size={30} /> Sair
                    </button>
                  </div>
                </>
              </div>
            </MenuList>
          </>
        </Menu>
      </div>
    </>
  );
};

export default DropDown;
