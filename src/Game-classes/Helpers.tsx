import { Game } from "./Game";
import { Piece } from "./Piece";

export function cloneGame(gameToClone: Game){
    let gameClone = structuredClone(gameToClone);
    Object.setPrototypeOf(gameClone,Object.getPrototypeOf(gameToClone));
    return gameClone;
}

export function cloneBoard(boardToClone:Piece[]){
    let newBoard = []
    for(let i = 0;i<boardToClone.length;i++){
        let newPiece = structuredClone(boardToClone[i])
        Object.setPrototypeOf(newPiece,Object.getPrototypeOf(boardToClone[i]))
        newBoard.push(newPiece);
        
    }
    return newBoard
}