"use client";
import DashMenu from "./components/dashMenu";
import NotRenewed from "../components/NotRenewedModal";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { useUSer } from "@/hooks";
import { differenceInDays, isAfter } from "date-fns";

const RootDashLayout = ({ children }: { children: React.ReactNode }) => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const { user, getUser, setMode } = useUSer();

  const paymentCheckout = () => {
    const now = new Date();
    if (user && user.subscription) {
      const nextPayment = new Date(user.subscription.next_payment);

      if (!isAfter(now, nextPayment)) {
        onClose();
      }

      if (isAfter(now, nextPayment)) {
        const daysLate = differenceInDays(now, nextPayment);

        if (daysLate > 0) {
          onOpen();

          return (
            <NotRenewed onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
          );
        }
      }
    }
  };

  useEffect(() => {
    paymentCheckout();
  }, [user]);

  return <main className="w-full h-full flex-grow ">{children}</main>;
};

export default RootDashLayout;
