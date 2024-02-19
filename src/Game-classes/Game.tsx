import { BlackPlayer, Player, WhitePlayer } from "./Player";
import { createContext } from "react";
import { BoardState } from "../Components/BoardState";


class Game{
    turns: number;
    players: Player[]
    currentBoardState: BoardState
    currentPlayer:Player
    constructor(){
        this.turns = 0;
        this.players = this.intialisePlayers();
        this.currentPlayer = this.determinePlayer();
        this.currentBoardState = this.intialiseBoardState();
    }
    private intialisePlayers():Player[]{
        let playerWhite = new WhitePlayer();
        let playerBlack = new BlackPlayer();
        return [playerWhite,playerBlack];
    }
    private determinePlayer():Player{
        return (this.turns%2) ? this.players[0] : this.players[1]; 
    }
    private intialiseBoardState(){
        
        let board = new BoardState();
        board.updateBoardState(this.players)
        return board
    }
    
    selectTile(tileX:number,tileY:number){
        
        this.currentPlayer = this.determinePlayer();
        let board = this.currentBoardState.getBoardState()
        for(let i =0;i<board.length;i++){
            if(board[i].posX == tileX && board[i].posY==tileY){
                
            }
        }
        
    }

    
}

export {Game};