import { Edit, Trash } from "lucide-react";
import { categoria } from "./array";
import { usePathname, useRouter } from "next/navigation";

const CategoryList = () => {
  const router = useRouter();
  const handleCategoryName = (name: string) => {
    return router.push(`/dashBoard/${name}`);
  };

  return (
    <>
      <ul className="w-full  h-[540px] justify-center  flex flex-wrap gap-7 pt-3 overflow-y-scroll">
        {categoria.map((item) => (
          <li
            key={item.id}
            onClick={() => handleCategoryName(item.nome)}
            className="w-[40%] h-[135px] group relative rounded-md h-[100px] bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${item.imagem})`,
            }}
          >
            <div className="w-full flex hidden group-hover:flex justify-between p-1">
              <Edit size={20} />
              <Trash size={20} />
            </div>
            {
              <span className="absolute text-[4vw] font-semibold font-nixie bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {item.nome}
              </span>
            }
          </li>
        ))}
      </ul>
    </>
  );
};

export default CategoryList;
