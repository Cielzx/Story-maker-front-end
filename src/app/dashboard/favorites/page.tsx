"use client";
import { useUSer } from "@/hooks";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FavoriteList from "./FavoriteList";
import ColorPicker from "@/app/components/ColorPicker";

const FavoritePage = () => {
  const { user, getUser } = useUSer();
  const [opacity, setOpacity] = useState(1);
  const [color, setColor] = useState("#FFFFFFFF");
  const [rgbcolor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const handleColorChange = (color: any) => {
    setColor(color.hex);
    setRgbColor(color.rgb);
  };

  const handleOpacityChange = (event: any) => {
    setOpacity(event.target.value);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex flex-col h-full">
      <div className="backgroundDash"></div>
      <div className="w-full h-full flex flex-col relative flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full h-full flex flex-col">
          <div className="w-full  h-full  flex flex-col fixed justify-center items-center">
            <div className="w-full flex items-center bg-black z-10 justify-center text-3xl text-center h-[100px]">
              <h1>Favoritos</h1>
              <button
                onClick={() => router.back()}
                className="absolute left-[6%]"
              >
                <ArrowLeft size={40} />
              </button>
            </div>

            <div
              className="w-[100%] h-full overflow-y-auto flex justify-center"
              style={{
                scrollbarWidth: "none",
              }}
            >
              <ColorPicker
                color={color}
                opacity={opacity}
                rgbcolor={rgbcolor}
                handleColorChange={handleColorChange}
                handleOpacityChange={handleOpacityChange}
                setShowPicker={setShowPicker}
                showPicker={showPicker}
              />

              <FavoriteList
                items={user.favorites}
                color={color}
                opacity={opacity}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FavoritePage;
