const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-grow flex-col ">
      <div className="backgroundDash"></div>
      <div className="w-full h-full flex flex-col flex-grow relative bg-cover bg-center text-white items-center ">
        <section className="w-full h-full flex flex-col absolute">
          {children}
        </section>
      </div>
    </div>
  );
};

export default RootLayout;
