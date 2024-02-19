import { createContext } from "react";
import { Game } from "./Game";



const GameContext = createContext(new Game());
export default GameContext;