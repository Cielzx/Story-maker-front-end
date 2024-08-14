import { useUSer } from "@/hooks";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const InfoPlan = () => {
  const { user, mode } = useUSer();

  const date = new Date(user!.subscription!.next_payment);

  const formattedDate = format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  return (
    <>
      {mode === "infoPlan" ? (
        <div className="w-full h-[80%] flex flex-col justify-center items-center  gap-3">
          <h2>Detalhes do plano</h2>
          {user && user.subscription ? (
            <div className="w-[80%]  flex flex-col gap-2">
              <div className="w-full flex flex-col">
                <h3>Plano</h3>
                <span>{user.subscription.plan.name}</span>
              </div>

              <div className="w-full flex flex-col">
                <h3>Próximo pagamento</h3>
                <span>{formattedDate}</span>
              </div>
            </div>
          ) : (
            <>
              <h1> ISSO AQUI NÃO É PRA EXISTIR</h1>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default InfoPlan;
