import { Game } from "./Game";
import { Pawn, Piece } from "./Piece";
import { pieceIdToFactory } from "./PieceFactory";

export function cloneGame(gameToClone: Game){
    let gameClone = structuredClone(gameToClone);
    Object.setPrototypeOf(gameClone,Object.getPrototypeOf(gameToClone));
    for(let i = 0; i <gameClone.currentBoardState.length;i++){
        let oldPiece = gameClone.currentBoardState[i]
        let nPieceId = oldPiece.pieceTypeID
        let PieceFactory = pieceIdToFactory(nPieceId)
        let nPiece = PieceFactory?.replicatePiece(oldPiece.color,oldPiece.posX,oldPiece.posY)
        if(!nPiece){throw new Error("Replication failed")}
        gameClone.currentBoardState[i] = nPiece

    }
    return gameClone;
}

export function cloneBoard(boardToClone:Piece[]){
    let newBoard:Piece[] = []
    for(let i = 0;i<boardToClone.length;i++){
        let newPiece = structuredClone(boardToClone[i])
        Object.setPrototypeOf(newPiece,Object.getPrototypeOf(boardToClone[i]))
        newBoard.push(newPiece);
        
    }
    return newBoard
}

export function PieceFactory(){

} 