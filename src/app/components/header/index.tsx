import { Search } from "lucide-react";

const Header = () => {
  return (
    <>
      <header className="flex w-full  items-center p-9 bg-[#053B89] max-[920px]:h-[70px] max-lg:p-5 max-[1560px]:w-full max-[2560px]:w-[75%] max-[3440px]:w-[75%] ">
        <div className="w-full flex justify-between">
          <div>
            <h1 className="text-2xl">Story Maker</h1>
          </div>

          <div className="w-[200px] h-[40px]">
            <img
              src="https://cdn.discordapp.com/attachments/894986882344161373/1263705412075524096/IMG_0957-removebg-preview.png?ex=669b34e0&is=6699e360&hm=a6948cd107649a1c5d1c0c13eda36abb08169301313bb2bb55437bd6a7efbc41&"
              className="w-full h-full"
              alt="Logo Story Maker"
            />
          </div>

          <div>
            <Search />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
