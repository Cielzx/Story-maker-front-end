interface props {
  name: string;
}

const SubCategorieContainer = ({ name: string }: props) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2>NOME DA CATEGORIA</h2>
      </div>

      <div>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default SubCategorieContainer;
