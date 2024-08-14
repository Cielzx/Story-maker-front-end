"use client";
import { useAuth, useUSer } from "@/hooks";
import { CombineCategorySchema } from "@/schemas/category.schema";
import { combinedUserData, updateUserForm } from "@/schemas/user.schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputProfile from "../ProfileInput";
import Toast from "@/app/components/Toast";

const UserEditForm = () => {
  const { user, updateUser, mode, setMode } = useUSer();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShow, setIsShow] = useState(false);
  const { RequestPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<combinedUserData>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const handlePassword = () => setIsShow(!isShow);
  const onSub = (data: combinedUserData) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    if (mode === "info" || mode == "changePassword") {
      if (newPassword !== confirmPassword) {
        return Toast({
          message: "Senhas não conferem tente novamente",
          isSucess: false,
        });
      }
      updateUser(user!.id, filteredData);
    }

    if (mode === "requestPassword") {
      RequestPassword(data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSub)}
      className="w-full h-[85%] flex flex-col justify-center items-center gap-3 absolute top-[17%] p-3"
    >
      {mode === "changePassword" ? (
        <>
          <div className="flex w-full items-center relative">
            <InputProfile
              type={isShow ? "text" : "password"}
              id="password"
              {...register("password")}
              onChange={(e) => setNewPassword(e.target.value)}
              label="Nova Senha"
            />

            <div className="h-[70px] flex items-center absolute top-[10%] right-[0%]">
              <button
                className="flex justify-center "
                onClick={() => handlePassword()}
                type="button"
              >
                {isShow && <EyeOff size={25} />}
                {!isShow && <Eye size={25} />}
              </button>
            </div>
          </div>

          <InputProfile
            type={isShow ? "text" : "password"}
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirmar Senha"
          />
        </>
      ) : mode === "requestPassword" ? (
        <>
          <InputProfile
            type="text"
            id="email"
            label="Seu E-mail"
            {...register("email")}
          />
        </>
      ) : (
        <>
          <InputProfile
            type="text"
            id="name"
            label="Nome"
            {...register("name")}
          />
          <InputProfile
            type="text"
            id="email"
            label="Email"
            {...register("email")}
          />
        </>
      )}

      <div className="w-full flex flex-col justify-center items-center">
        {mode === "requestPassword" ? (
          <button type="submit" className="btn-form">
            Enviar
          </button>
        ) : (
          <div className="w-full flex flex-col items-center">
            <button type="submit" className="btn-form">
              Atualizar
            </button>
            {mode === "changePassword" ? (
              <>
                <span
                  onClick={() => setMode("requestPassword")}
                  className="text-sm text-gray-400"
                >
                  Esqueceu a senha?
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default UserEditForm;
