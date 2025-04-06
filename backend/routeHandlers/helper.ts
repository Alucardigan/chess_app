import BitBoard from "backend/bitboard"
import GameRunner from "backend/gameRunner"

let activeMatches = new Map<number,GameRunner>()
export enum GameColor {
    WHITE,
    BLACK
}
export default activeMatches