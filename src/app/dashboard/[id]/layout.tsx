"use client";

import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const cookies = parseCookies();

  if (!cookies["user.Token"]) {
    router.push("/login");
  }

  return (
    <div className="w-full flex flex-col min-h-svh">
      <div className="backgroundDash"></div>
      <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col h-[100vh]">{children}</section>
      </main>
    </div>
  );
};

export default RootLayout;
