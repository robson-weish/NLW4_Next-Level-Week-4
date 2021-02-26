import { createContext, useState, ReactNode } from "react";
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | ' eye' ,
    description: string ,
    amount: number ;

}

interface ChallengeContextData {
    level: number;
    currentExperience:number;
    experienceToNextLevel: number, 
    challengesCompleted:number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenges: () => void,
    resetChallenge: () => void;

}

interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext( {} as ChallengeContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow( (level + 1 ) * 4 , 2) // Calculo usado para RPG's

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenges() {
    console.log("New Challenge");
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge (challenge)
  }

  function resetChallenge () {
      setActiveChallenge(null);
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
    }}>
      {children}
    </ChallengesContext.Provider>
  );
}
