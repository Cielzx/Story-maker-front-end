"use client";
import { useEffect, useState } from "react";
import Input from "../components/Input";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks";
import Toast from "../components/Toast";

const ResestPassword = ({
  searchParams,
}: {
  searchParams?: { [token: string]: string };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [token, setToken] = useState("");
  const { ResetPassword } = useAuth();

  console.log(token);
  const handlePassword = () => setIsShow(!isShow);
  const onSub = (data: any) => {
    if (newPassword !== confirmPassword) {
      return Toast({
        message: "Senhas não conferem tente novamente",
        isSucess: false,
      });
    }
    ResetPassword(data, token);
  };

  useEffect(() => {
    setToken(searchParams!.token);
  }, []);

  return (
    <div className="w-full flex flex-col h-svh">
      <div className="backgroundDash "></div>
      <main className="w-full flex flex-col flex-grow bg-cover bg-center text-white items-center ">
        <section className="w-full flex flex-col justify-center items-center h-[100vh]">
          <div className="w-full h-full justify-center items-center flex flex-col">
            <div className="text-center h-40 w-full flex justify-center items-center">
              <img
                src="https://images2.imgbox.com/68/26/AGtl8eED_o.png"
                className="w-3/4 object-contain h-[171%]"
                alt=""
              />
            </div>
            <form onSubmit={handleSubmit(onSub)} className="w-[80%]">
              <div className="w-full flex flex-col gap-2">
                <Input
                  type={isShow ? "text" : "password"}
                  id="newPassword"
                  label="Nova senha"
                  {...register("newPassword")}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex justify-end items-center">
                  <Input
                    type={isShow ? "text" : "password"}
                    id="password"
                    label="Confirmar senha"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <div className="h-[70px] flex items-center fixed">
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

                <div className="w-[100%] flex justify-center items-center min-[940px]:w-full">
                  <button className="btn-form">Enviar</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResestPassword;
