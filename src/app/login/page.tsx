"use client";
import { useState } from "react";
import LoginForm from "./components/LoginForm";
import dynamic from "next/dynamic";

import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

const Login = () => {
  const [mode, setMode] = useState("login");
  return (
    <div className="flex flex-col min-h-screen">
      <div className="backgroundImage"></div>
      <main className="flex flex-grow bg-cover bg-center text-white items-center z-[99999]">
        <section className="flex flex-col justify-center items-center w-full ">
          <div className="w-full h-full justify-center items-center flex flex-col">
            <div className="text-center h-40 w-full flex justify-center items-center">
              <img
                src="https://images2.imgbox.com/68/26/AGtl8eED_o.png"
                className="w-3/4 object-contain h-[171%]"
                alt=""
              />
            </div>
            <div className="flex w-[50%] flex-col h-1/2 justify-center relative items-center">
              <LoginForm mode={mode} setMode={setMode} />

              {mode === "register" ? (
                <></>
              ) : (
                <Link
                  className="absolute left-[11%] bottom-[22%]"
                  onClick={() => {
                    setMode("resetPassword");
                    if (mode === "resetPassword") {
                      setMode("login");
                    }
                  }}
                  href={""}
                >
                  {mode === "resetPassword"
                    ? "Voltar pro login"
                    : "Esqueceu sua senha?"}
                </Link>
              )}

              <div className="w-[80%] min-[940px]:w-[80%]  flex justify-end p-2 flex-col">
                {mode === "register" ? (
                  <></>
                ) : (
                  <>
                    <div className="flex flex-col justify-end w-full h-[90px]">
                      <span className="text-[1rem] text-gray-400">
                        Não tem um conta?
                      </span>
                      <span
                        onClick={() => setMode("register")}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        Registre-se <IoIosArrowForward />{" "}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
