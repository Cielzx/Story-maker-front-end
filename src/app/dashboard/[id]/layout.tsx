"use client";

import DashMenu from "../components/dashMenu";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="backgroundDash"></div>
      <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col">{children}</section>
      </main>
    </div>
  );
};

export default RootLayout;
