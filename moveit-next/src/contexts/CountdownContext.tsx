import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownContextProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownContextProps) {
  const { startNewChallenges } = useContext(ChallengesContext);

  const [time, setTime] = useState(0.1 * 60); /// TROCAR O 0.1 PARA 25 PARA VOLTAR AOS 25 MINUTOS
  const [isActive, setisActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  function startCountdown() {
    setisActive(true);
  }

  function resetCountdown() {
    clearTimeout(countdownTimeout); // Não deixa descer mais um segundo
    setisActive(false); // Faz o tempo parar
    /// TROCAR O 0.1 PARA 25 PARA VOLTAR AOS 25 MINUTOS
    setTime(0.1 * 60); // Volta para os 25 minutos
    setHasFinished(false)
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time == 0) {
      setHasFinished(true);
      setisActive(false);
      startNewChallenges();
    }

    //console.log(isActive);
  }, [isActive, time]);

  return (
    <CountdownContext.Provider value={{
        minutes, 
        seconds, 
        hasFinished, 
        isActive, 
        startCountdown, 
        resetCountdown,
    }}>
        {children}
    </CountdownContext.Provider>
  );
}
