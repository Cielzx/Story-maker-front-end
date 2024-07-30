import { parseCookies } from "nookies";
import DashMenu from "./components/dashMenu";
import { useRouter } from "next/navigation";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex-[1] overflow-scroll">{children}</main>
    </>
  );
};

export default RootDashLayout;
