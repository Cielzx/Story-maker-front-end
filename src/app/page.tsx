import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Loading from "./components/Loading";

export default function Home() {
  return (
    <main className="flex w-[100%] min-h-screen  flex-col items-center justify-between">
      <div className="backgroundImage"></div>
      <section className="flex flex-col justify-between w-[100%] h-[100vh] text-white">
        {/* <div className="flex w-[100%]  flex-col justify-between gap-[40px]  border border-solid border-red-600 p-4 ">
          <h1>Story Maker</h1>

          <p className="text-3xl">
            Sejam bem vindos a story makes, onde você pode compartilhar
            figurinhas no seu stories ^^
          </p>
        </div> */}

        <Loading />
      </section>
    </main>
  );
}
