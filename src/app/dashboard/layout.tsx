"use client";
import { parseCookies } from "nookies";
import DashMenu from "./components/dashMenu";
import { useRouter } from "next/navigation";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const cookies = parseCookies();

  if (!cookies["user.Token"]) {
    router.push("/login");
  }

  return (
    <div className="relative">
      {children}
      <DashMenu />
    </div>
  );
};

export default RootDashLayout;
