"use client";
import { useUSer } from "@/hooks";
import { useEffect } from "react";
import Loading from "@/app/components/Loading";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FavoriteList from "./FavoriteList";

const FavoritePage = () => {
  const { user, getUser } = useUSer();
  const router = useRouter();

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div className="backgroundDash"></div>
      <div className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full h-full flex flex-col">
          <div className="w-full flex items-center bg-black z-10 justify-center text-3xl text-center h-[100px]">
            <h1>Favoritos</h1>
            <button
              onClick={() => router.back()}
              className="absolute left-[6%]"
            >
              <ArrowLeft size={40} />
            </button>
          </div>

          <div className="w-[90%] h-full overflow-y-auto">
            <FavoriteList items={user.favorites} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FavoritePage;
