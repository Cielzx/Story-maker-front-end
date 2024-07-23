"use client";
import Input from "@/app/components/Input";
import { Eye, EyeOff } from "lucide-react";
import { IoIosArrowForward } from "react-icons/io";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuth } from "@/hooks";
import { useForm, UseFormRegister } from "react-hook-form";
import { ZodSchema } from "zod";
import {
  combinedSchema,
  CombinedSchema,
  iErrosType,
  iRegisterData,
  LoginData,
  loginData,
  RegisterData,
} from "./validator";
import inputSchema from "@/schemas/inputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register } from "module";

interface iRegisterProps {
  setMode: Dispatch<SetStateAction<string>>;
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
  register: UseFormRegister<CombinedSchema>;
  handlePassword: () => void;
}

const RegisterForm = ({
  setMode,
  isShow,
  setIsShow,
  register,
  handlePassword,
}: iRegisterProps) => {
  return (
    <>
      <div className="flex flex-col text-white-400 min-[940px]:w-[100%] gap-5">
        <Input type="text" {...register("name")} id="name" label="Usuario" />
        <Input type="text" {...register("email")} id="email" label="Email" />
        <div className="flex justify-end items-center">
          <Input
            type={isShow ? "text" : "password"}
            id="password"
            label="Senha"
            {...register("password")}
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
      </div>

      <div className="w-[100%] flex justify-center items-center">
        <button className="btn-form">Registrar</button>
      </div>

      <div className="w-[100%] h-[20%] flex flex-col">
        <span
          onClick={() => setMode("login")}
          className="flex items-center gap-3 cursor-pointer"
        >
          Voltar para o login <IoIosArrowForward />{" "}
        </span>
      </div>
    </>
  );
};

export default RegisterForm;
