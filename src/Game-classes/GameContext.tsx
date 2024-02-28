import { createContext, useState } from "react";
import { Game } from "./Game";


interface GameContextValue {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

const GameContext = createContext<GameContextValue>({gameState: new Game(),setGameState: ()=> {}});
export default GameContext;