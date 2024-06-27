import Game from "../backend/Game-classes/Game"
import { Color } from "../backend/Game-classes/Piece"

//backend updates each frontend by sending what the game currently looks like
export  interface GameFormat{
    pieces: PieceFormat[]
    checkMate:Color
}
export interface PieceFormat{
    fileName: string|undefined,
    positionX: number,
    positionY: number 
} 

export function exportToGF(game:Game){
    let GF:GameFormat = {pieces:[],checkMate:game.checkMate}
    for(let i = 0; i < game.currentBoardState.length; i++){
        const piece:PieceFormat = {fileName:game.currentBoardState[i].imageLink,positionX:game.currentBoardState[i].posX,positionY:game.currentBoardState[i].posY}
        GF.pieces.push(piece)  
    }
    return GF
}
export interface MoveRequest{
    pieceX:number, 
    pieceY:number, 
    newX:number,
    newY:number
}
export interface MoveResponse{
    playerColor:boolean,
    gameFormat: GameFormat
}