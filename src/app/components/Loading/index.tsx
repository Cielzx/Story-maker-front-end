import { Spinner } from "@chakra-ui/spinner";

const Loading = () => {
  return (
    <main className="min-h-screen relative flex items-center justify-center backgroundDash text-white">
      <div className="flex relative">
        <img
          src="https://images2.imgbox.com/68/26/AGtl8eED_o.png"
          className="w-full object-contain absolute  h-[100%]"
          alt=""
        />
        <Spinner className="w-[230px] h-[230px]" color="white" />
      </div>
    </main>
  );
};

export default Loading;
