import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <main className="flex w-[100%] min-h-screen flex-col items-center backgroundImage justify-between ">
      <section className="flex flex-col justify-between w-[100%] h-[100vh] text-white">
        <div className="flex w-[100%]  flex-col justify-between gap-[40px]  border border-solid border-red-600 p-4 ">
          <h1>Story Maker</h1>

          <p className="text-3xl">
            Sejam bem vindos a story makes, onde você pode compartilhar
            figurinhas no seu stories ^^
          </p>
        </div>

        <div className="flex flex-col w-[100%] gap-[10px] items-center justify-center p-2">
          <Link
            className="w-[60%] h-[40px] flex justify-center items-center gap-2 rounded-[10px] bg-purple-600 text-[white] text-center text-2xl"
            href={"/login"}
          >
            Entre agora <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
