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
export class GameStateException extends Error{
    title : string
    priority: string
    constructor(title:string,priority:string ,message:string){
        super(message)
        this.title = title
        this.priority = priority
    }
}
export enum GameAction{
    PromotionRequired
}
export class GameActionRequiredException extends Error{
    gameAction: GameAction  
    constructor(gameAction:GameAction ,message:string){
        super(message)
        this.gameAction = gameAction
    }
}
export interface CastleRookMove {
    flag : Boolean,
    nflag : Boolean,
    rFromMask: bigint,
    rToMask: bigint,
    kFromMask : bigint,
    kToMask : bigint,
    rPieceIdx : number,
    kPieceIdx : number
}
export interface PromotionTarget{
    white : number,
    black : number
}

export default activeMatches