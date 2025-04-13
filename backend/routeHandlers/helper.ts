import BitBoard from "backend/bitboard"
import GameRunner from "backend/gameRunner"

let activeMatches = new Map<number,GameRunner>()
export enum GameColor {
    WHITE,
    BLACK
}
export enum GameType{
    PLAYER,
    AI
}
export interface ChatMessage{
    username: string|GameColor|undefined ,
    chatMessage: string
}

export default activeMatches