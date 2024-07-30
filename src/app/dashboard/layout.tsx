import { parseCookies } from "nookies";
import DashMenu from "./components/dashMenu";
import { useRouter } from "next/navigation";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex-[1]">
      <div className="h-full">{children}</div>
    </div>
  );
};

export default RootDashLayout;
