import { parseCookies } from "nookies";
import DashMenu from "./components/dashMenu";
import { useRouter } from "next/navigation";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-svh">
      <div
        className="h-full absolute left-0 top-0 right-0 bottom-0 flex z-0"
        style={{
          visibility: "inherit",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default RootDashLayout;
