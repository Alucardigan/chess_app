import Game from "../backend/Game-classes/Game"

//backend updates each frontend by sending what the game currently looks like
export  interface GameFormat{
    pieces: PieceFormat[]
}
export interface PieceFormat{
    fileName: string|undefined,
    positionX: number,
    positionY: number 
} 

export function exportToGF(game:Game){
    let GF:GameFormat = {pieces:[]}
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
