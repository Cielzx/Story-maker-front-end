import DashMenu from "./components/dashMenu";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
        <DashMenu />
      </body>
    </html>
  );
};

export default RootDashLayout;
