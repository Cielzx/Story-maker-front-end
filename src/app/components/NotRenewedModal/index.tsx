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
          onOpen();
        }
      }
    }
  };
  useEffect(() => {
    getUser();
    paymentCheckout();
  }, [user, paymentCheckout]);
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      headerText="ALERTA!"
      MaxWidthBody="100%"
      MaxWidthHeader="100%"
      widthBody="100%"
      widthHeader="100%"
      heightBody="100%"
    >
      <div className="w-[100%] h-full flex flex-col gap-1">
        <div className="w-full flex flex-col h-full justify-center items-center gap-2">
          <div className="w-[80%] flex relative flex-col items-center text-clip gap-4">
            <AlertTriangle className="text-black" size={60} fill="yellow" />
            <div className="w-[500px] max-[680px]:w-full text-justify flex items-center flex-col gap-1 p-2">
              <p className="text-white text-2xl">
                Parece que sua assinatura não foi renovada
              </p>
              <p className="text-white text-2xl">
                Por favor renove sua assinatura para continuar usando nosso
                produto
              </p>
            </div>
          </div>

          <div className="w-[80%] flex justify-center items-center">
            <button
              onClick={() => router.push("/login")}
              className="w-[200px] btn-form text-white"
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
