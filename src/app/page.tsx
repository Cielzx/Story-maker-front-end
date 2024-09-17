import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Loading from "./components/Loading";

export default function Home() {
  return (
    <main className="flex w-[100%] min-h-screen  flex-col items-center justify-between">
      <div className="backgroundImage"></div>
      <section className="flex flex-col justify-between w-[100%] h-[100vh] text-white">
        <Loading />
      </section>
    </main>
  );
}
