"use client";
import Input from "@/app/components/Input";
import { Eye, EyeOff } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuth } from "@/hooks";
import { useForm } from "react-hook-form";
import { CombinedSchema } from "./validator";
import RegisterForm from "./RegisterForm";

interface iLoginProps {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

const LoginForm = ({ mode, setMode }: iLoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombinedSchema>();
  const [isFocused, setIsFocused] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const { loginFunction, registerFunction, RequestPassword } = useAuth();

  const onSub = (data: CombinedSchema) => {
    if (mode === "login") {
      loginFunction(data);
    } else if (mode === "register") {
      registerFunction(data);
    } else if (mode === "resetPassword") {
      RequestPassword(data);
    }
  };

  const handlePassword = () => setIsShow(!isShow);

  return (
    <div className="w-full max-[1900px]:w-[700px] flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSub)}
        className="w-[80%] min-[940px]:w-[80%] min-[940px]:items-center flex flex-col  gap-5 p-2"
      >
        {mode === "register" ? (
          <>
            <RegisterForm
              setMode={setMode}
              isShow={isShow}
              setIsShow={setIsShow}
              register={register}
              handlePassword={handlePassword}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-5 min-[940px]:w-[100%] max-[940px]:w-full">
              {mode === "resetPassword" ? (
                <>
                  <div className="flex justify-center">
                    <Input
                      type="text"
                      id="email"
                      label="E-mail"
                      {...register("email")}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <Input
                      type="text"
                      id="email"
                      label="E-mail"
                      {...register("email")}
                    />
                  </div>

                  <div className="flex justify-end relative items-center">
                    <Input
                      type={isShow ? "text" : "password"}
                      id="password"
                      label="Senha"
                      {...register("password")}
                    />

                    <div className="h-[70px] flex absolute items-center fixed">
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
                </>
              )}
            </div>

            <div className="w-[100%] flex justify-center items-center min-[940px]:w-full">
              <button className="btn-form">
                {mode === "resetPassword" ? "Enviar" : "Entrar"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
