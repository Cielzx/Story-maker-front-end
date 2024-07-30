import { parseCookies } from "nookies";
import DashMenu from "./components/dashMenu";
import { useRouter } from "next/navigation";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative h-full"
      style={{
        height: `calc(var(--vh, 1vh) * 100)`,
      }}
    >
      <div className="h-full">{children}</div>
    </div>
  );
};

export default RootDashLayout;
