import { BlackPlayer, Player, WhitePlayer } from "./Player";
import { useContext } from "react";
import GameContext from "./GameContext";
import { Piece } from "./Piece";


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
    determinePlayer():number{
        return (this.turns%2); 
    }
    intialiseBoardState(){
        let board:Piece[] = [];
        this.players.forEach((player)=>board = board.concat(player.pieces));
        return board;
    }
    
}
export function cloneGame(gameToClone: Game){
    let gameClone = structuredClone(gameToClone);
    Object.setPrototypeOf(gameClone,Object.getPrototypeOf(gameToClone));
    return gameClone;
}

