import { BlackPlayer, Player, WhitePlayer } from "./Player";
import { useContext } from "react";
import GameContext from "./GameContext";
import { King, Piece } from "./Piece";
import { cloneBoard, cloneGame } from "./Helpers";


export class Game{
    turns: number;
    players: Player[]
    currentBoardState: Piece[]
    selectedPiece: Piece|null;
    constructor(){
        this.turns = 0;
        this.players = this.intialisePlayers();
        this.currentBoardState = this.intialiseBoardState();
        this.selectedPiece = null;
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
    static determinePlayer(game:Game):number{
        return (game.turns%2); 
    }
    static tickTurn(game:Game){
        game.turns += 1;
        
        if(this.checkIfMate(game.currentBoardState)){console.log("King is mated")}
        const gameClone = cloneGame(game)
        console.log(gameClone)
        return gameClone 
    }
    static checkIfMate(currentBoardState:Piece[]){
    /*
    Function to check if a king is currently in mate 
    */
        let kingPieces=[] 
        kingPieces = currentBoardState.filter((piece)=>piece.pieceTypeID===6)
        for(let i = 0;i<kingPieces.length;i++){
            let kpiece = kingPieces[i] as  King; 
            console.log(kpiece.checkInCheck(currentBoardState))
            if(kpiece.checkInCheck(currentBoardState)){
                let actions = kpiece.generateMoveLogic(currentBoardState);
                console.log(actions)
                let canBlock = this.checkIfBlock(currentBoardState,kpiece)
                console.log(canBlock)
                if(!canBlock){
                    for(let j =0;j<actions.length;j++){
                        let nonRefBoard = cloneBoard(currentBoardState)
                        let resultingBoard = actions[j].execute(nonRefBoard);
                        let nKingPiece = resultingBoard.find((piece)=>piece.pieceTypeID===6&&piece.color===kpiece.color)
                        if(!nKingPiece){return false}
                        let newKingPiece = nKingPiece as King;//declaring as unknown then converting
                        console.log(newKingPiece,resultingBoard)
                        if(!newKingPiece.checkInCheck(resultingBoard)){
                            console.log(actions[j])
                            return false;
                        }
                    }
                    return true;//cant block and not move to a position that leads to not checks
                }
            };
        }
        return false;
    }
    static checkIfBlock(currentBoardState:Piece[],checkedKing:King){
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
                    if(!checkedKing.checkInCheck(resultingBoard)){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
