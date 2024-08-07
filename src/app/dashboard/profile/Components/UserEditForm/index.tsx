import Input from "@/app/components/Input";
import { loginData } from "@/app/login/components/validator";
import { userData } from "@/context/userContext";
import { useAuth, useUSer } from "@/hooks";
import { CombineCategorySchema } from "@/schemas/category.schema";
import { combinedUserData, updateUserForm } from "@/schemas/user.schema";
import { useForm } from "react-hook-form";

const UserEditForm = () => {
  const { user, updateUser, mode } = useUSer();
  const { RequestPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<combinedUserData>();

  const onSub = (data: combinedUserData) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    if (mode === "info") {
      updateUser(user!.id, filteredData);
    }

    if (mode === "requestPassword") {
      RequestPassword(data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSub)}
      className="w-full h-full flex flex-col justify-center items-center gap-3"
    >
      {mode === "requestPassword" ? (
        <div className="max-[940px]:w-full min-[940px]:w-full border-b border-1 border-black">
          <label className="block  font-semibold mb-2">Email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="input-style w-full text-black text- outline-none"
          />
        </div>
      ) : (
        <>
          <div className=" max-[940px]:w-full min-[940px]:w-full border-b border-1 border-black ">
            <label className="block  font-semibold mb-2">Nome</label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="input-style w-full text-black text- outline-none"
            />
          </div>
          <div className="max-[940px]:w-full min-[940px]:w-full border-b border-1 border-black">
            <label className="block  font-semibold mb-2">Email</label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="input-style w-full text-black text- outline-none"
            />
          </div>
        </>
      )}

      <div className="w-full flex justify-center">
        {mode === "requestPassword" ? (
          <button type="submit" className="btn-form">
            Enviar
          </button>
        ) : (
          <button type="submit" className="btn-form">
            Atualizar
          </button>
        )}
      </div>
    </form>
  );
};

export default UserEditForm;
