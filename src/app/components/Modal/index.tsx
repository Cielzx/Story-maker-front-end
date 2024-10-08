"use client";

import { IoIosClose } from "react-icons/io";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useUSer } from "@/hooks";

interface ModalChildren {
  children: React.ReactNode;
  isOpen: boolean;
  headerText?: string;
  onClose: () => void;
  MaxWidthHeader: string;
  MaxWidthBody: string;
  widthHeader: string;
  widthBody: string;
  heightBody?: string;
}

const CustomModal = ({
  isOpen,
  onClose,
  children,
  headerText,
  MaxWidthHeader,
  MaxWidthBody,
  widthHeader,
  widthBody,
  heightBody,
}: ModalChildren) => {
  const { mode, setMode } = useUSer();
  return (
    <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        style={{
          flexGrow: 0,
          flexShrink: 0,
          height: "-webkit-fill-available",
        }}
        className="flex flex-col items-center justify-center z-10  bg-black bg-opacity-70 "
      >
        <ModalBody
          style={{
            padding: "1rem",
            flexGrow: 0,
            flexShrink: 0,
            height: heightBody,
          }}
          className="bg-[rgba(0,0,0,0.9)] flex w-[100%] flex-col relative gap-5 justify-start p-5 min-[940px]:w-[600px] "
        >
          <ModalHeader
            style={{
              maxWidth: MaxWidthHeader,
              flexGrow: 0,
              flexShrink: 0,
              height: "30px",
              padding: "5px",
            }}
            className="bg-transparent w-[100%] flex justify-between items-center text-white  p-4 max-[920px]:w-[100%]"
          >
            <p className="font-bold text-xl">{headerText}</p>

            {headerText === "ALERTA!" ? (
              <></>
            ) : (
              <button onClick={onClose}>
                <IoIosClose
                  onClick={() => setMode("")}
                  className="text-4xl cursor-pointer"
                />
              </button>
            )}
          </ModalHeader>
          {children}
        </ModalBody>
      </ModalOverlay>
    </Modal>
  );
};

export default CustomModal;
