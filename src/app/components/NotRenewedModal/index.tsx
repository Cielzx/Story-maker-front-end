"use client";
import { AlertTriangle } from "lucide-react";
import CustomModal from "../Modal";
import { useUSer } from "@/hooks";
import { differenceInDays, isAfter, isBefore } from "date-fns";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  id?: string;
}
const NotRenewed = ({ isOpen, onClose, onOpen }: modalProps) => {
  const { user, getUser, setMode } = useUSer();
  const router = useRouter();
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
          setMode("notRenewed");
          onOpen();
        }
      }
    }
  };
  useEffect(() => {
    getUser();
    paymentCheckout();
  }, [user]);
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      headerText=""
      MaxWidthBody="100%"
      MaxWidthHeader="100%"
      widthBody="100%"
      widthHeader="100%"
      heightBody="100%"
    >
      <div className="w-[100%] h-full flex flex-col gap-2">
        <h2 className="text-xl text-white text-center">
          ASSINATURA NÃO RENOVADA
        </h2>

        <div className="w-full flex flex-col h-full justify-center items-center gap-2">
          <AlertTriangle className="text-black" size={60} fill="yellow" />
          <p className="text-white text-2xl">
            Parece que sua assinatura não foi renovada
          </p>
          <p className="text-white text-2xl">
            Por favor renove sua assinatura para continuar usando nosso produto
          </p>

          <div className="w-full">
            <button
              onClick={() => router.push("/login")}
              className="w-[90%] btn-form text-white"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default NotRenewed;
