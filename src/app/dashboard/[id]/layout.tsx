const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-grow flex-col h-full">
      <div className="backgroundDash"></div>
      <main className="w-full h-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full h-full flex flex-col">{children}</section>
      </main>
    </div>
  );
};

export default RootLayout;
