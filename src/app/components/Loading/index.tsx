"use client";
import { Spinner } from "@chakra-ui/spinner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

const Loading = () => {
  const pathname = usePathname();
  return (
    <main className="min-h-screen relative flex flex-col gap-4 items-center justify-center z-[99999px] text-white">
      <div className="flex relative ">
        <img
          src="https://images2.imgbox.com/68/26/AGtl8eED_o.png"
          className="w-full object-contain absolute  h-[100%]"
          alt=""
        />
        <Spinner className="w-[230px] h-[230px]" color="white" />
      </div>

      {pathname === "/" ? (
        <>
          <div className="flex flex-col w-[100%] gap-[10px] items-center justify-center p-2">
            <Link
              className="w-[60%] h-[40px] flex justify-center items-center gap-2 rounded-sm bg-purple-600 text-[white] text-center text-2xl"
              href={"/login"}
            >
              Entre agora <FaArrowRight />
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </main>
  );
};

export default Loading;
