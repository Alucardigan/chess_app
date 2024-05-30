import { BlackPlayer, Player, WhitePlayer } from "./Player";
import { useContext } from "react";
import GameContext from "./GameContext";
import { Color, King, Piece } from "./Piece";
import { cloneBoard, cloneGame } from "./Helpers";


export default class Game{
    turns: number;
    players: Player[]
    currentBoardState: Piece[]//TODO: I think a better data structure is needed
    selectedPiece: Piece|null;
    checkMate:Color
    constructor(){
        this.turns = 0
        this.players = this.intialisePlayers();
        this.currentBoardState = this.intialiseBoardState();
        this.selectedPiece = null;
        this.checkMate = Color.UNASSIGNED;
    }
    intialisePlayers():Player[]{
        let playerWhite = new WhitePlayer();
        let playerBlack = new BlackPlayer();
        return [playerWhite,playerBlack];
    }
    
    intialiseBoardState(){
        let board:Piece[] = [];
        this.players.forEach((player)=>board = board.concat(player.pieces));
        return board;
    }
    
}
    
export class gameFunction{
    //TODO: REFACTOR ALL OF THIS
    static determinePlayer(game:Game):Color{
        const colorNum = (game.turns%2);
        if(colorNum){
            return Color.BLACK
        } 
        return Color.WHITE
    }
    
    static checkInCheck(currentBoardState:Piece[],kpiece:Piece){
        for(let i = 0;i<currentBoardState.length;i++){
            let piece = currentBoardState[i]
            if(piece.color!==kpiece.color && kpiece.pieceTypeID!==piece.pieceTypeID){
                let actions = piece.generateMoveLogic(currentBoardState);
                for(let j = 0; j<actions.length;j++){
                    if(actions[j].newPosX===kpiece.posX && actions[j].newPosY===kpiece.posY){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    static checkIfMate(currentBoardState:Piece[],kpiece:Piece){
    /*
    Function to check if a king is currently in mate 
    */
        if(this.checkInCheck(currentBoardState,kpiece)){
            let actions = kpiece.generateMoveLogic(currentBoardState);
            let canBlock = this.checkIfBlock(currentBoardState,kpiece)
            if(!canBlock){
                for(let j =0;j<actions.length;j++){
                    let nonRefBoard = cloneBoard(currentBoardState)
                    let resultingBoard = actions[j].execute(nonRefBoard);
                    let nKingPiece = resultingBoard.find((piece)=>piece.pieceTypeID===6&&piece.color===kpiece.color)
                    if(!nKingPiece){return false}
                    let newKingPiece = nKingPiece as King;//declaring as unknown then converting
                    if(!this.checkInCheck(resultingBoard,newKingPiece)){
                        return false;
                    }
                }
                return true;//cant block and not move to a position that leads to not checks
            }
        };
        console.log("NOT IN CHECK")
        return false;
    }
    static checkIfBlock(currentBoardState:Piece[],checkedKing:Piece){
    /*
    Function that checks if a piece can block mate. 
    returns true if a piece can block else false
    */
        let blockColor = checkedKing.color
        for(let i = 0; i<currentBoardState.length;i++){
            if(currentBoardState[i].color === blockColor&&currentBoardState[i].pieceTypeID!==6){
                let actions = currentBoardState[i].generateMoveLogic(currentBoardState)
                for(let j =0;j<actions.length;j++){
                    let nonRefBoard = cloneBoard(currentBoardState)
                    let resultingBoard = actions[j].execute(nonRefBoard);
                    if(!this.checkInCheck(resultingBoard,checkedKing)){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    static findPiece(pieceX:number,pieceY:number,currentBoardState:Piece[]){
        const foundPiece =  currentBoardState.find((curPiece)=>curPiece.posX === pieceX && curPiece.posY=== pieceY)
        return foundPiece;
    }
}
