import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { setPhoneNumber, setUsername } from "../../api/accountApi";

export function useAccountActions() {
  const navigate = useNavigate();

  const updateUsername = useCallback(async (username: string) => {
    try {
      await setUsername({ username });
      toast.success("Username atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar username:", error);
      toast.error("Ocorreu um erro ao atualizar o username. Tente novamente.");
      return false;
    }
  }, []);

  const updatePhoneNumber = useCallback(async (phoneNumber: string) => {
    try {
      await setPhoneNumber({ phoneNumber });
      toast.success("Número de telefone atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar número de telefone:", error);
      toast.error(
        "Ocorreu um erro ao atualizar o número de telefone. Tente novamente."
      );
      return false;
    }
  }, []);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    updateUsername,
    updatePhoneNumber,
    goBack,
  };
}