import SubCategorieContainer from "./components/SubCategorieContainer";

const SubCategoriePage = ({ params }: { params: { name: string } }) => {
  <div className="w-full flex flex-col min-h-screen">
    <div className="backgroundDash "></div>
    <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
      <SubCategorieContainer name={params.name} />
    </main>
  </div>;
};

export default SubCategoriePage;
