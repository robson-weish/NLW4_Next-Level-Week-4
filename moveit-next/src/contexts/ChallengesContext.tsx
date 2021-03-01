import { createContext, useState, ReactNode, useEffect } from "react";
import Cookies from 'js-cookie';
import challenges from "../../challenges.json";

interface Challenge {
  type: "body" | " eye";
  description: string;
  amount: number;
}

interface ChallengeContextData {
  level: number;
  currentExperience: number;
  experienceToNextLevel: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  levelUp: () => void;
  startNewChallenges: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
  const [level, setLevel] = useState( rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState( rest.challengesCompleted ?? 0);

  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2); // Calculo usado para RPG's

  // Permissão do usuario para notificações
  useEffect ( () => {
    Notification.requestPermission();
  } , [] )

  // FIM DA PERMISSÃO 


  // SALVANDO OS DADOS EM COOKIES 
  
  useEffect ( () => {
    Cookies.set('level' , String(level));
    Cookies.set('currentExperience' , String(currentExperience));
    Cookies.set('challengesCompleted' , String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted] );


  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenges() {
    console.log("New Challenge");
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    // CONFIGURANDO A NOTIFICAÇÃO PARA O USUARIO

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo Desafio' , {
        body: `Valendo ${challenge.amount} XP!!`
      })
    }

    // FIM DA CONFIGURAÇÃO 
    // ATIVAR AS NOTIFICAÇÕES DO CHROME PARA TESTE
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    // Let veio do " Let in change "

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {

      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();

    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted( challengesCompleted + 1);
    
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        experienceToNextLevel,
        challengesCompleted,
        levelUp,
        startNewChallenges,
        activeChallenge,
        resetChallenge,
        completeChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
}
