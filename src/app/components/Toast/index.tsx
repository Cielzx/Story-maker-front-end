import { toast } from "react-toastify";

interface IToastProps {
  message: string;
  isSucess?: boolean;
}
const Toast = ({ message, isSucess = false }: IToastProps) => {
  return isSucess
    ? toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    : toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
};

export default Toast;
