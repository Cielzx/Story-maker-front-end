import DashMenu from "./components/dashMenu";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      {children}
      <DashMenu />
    </div>
  );
};

export default RootDashLayout;
