"use client";
import DashMenu from "./components/dashMenu";
import NotRenewed from "../components/NotRenewedModal";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  const { onClose, isOpen, onOpen } = useDisclosure();

  return (
    <main className="w-full h-full flex-grow">
      {children}

      <NotRenewed onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
    </main>
  );
};

export default RootDashLayout;
