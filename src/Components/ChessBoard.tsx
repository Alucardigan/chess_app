import React from "react";
import './ChessBoard.css'
import Tile from "./Tile";
import { WhitePlayer,BlackPlayer, Player } from "../Game-classes/Player";
import { Piece } from "../Game-classes/Piece";
import {Game} from "../Game-classes/Game";
import { JsxElement } from "typescript";

class BoardState{
    boardState: Piece[]
    constructor(){
        this.boardState = []
    }
    updateBoardState(players:Player[]){
        for(let i =0;i<players.length;i++){
            let player = players[i];
            this.boardState = this.boardState.concat(player.pieces);
        }
    }
    getBoardState(){
        return this.boardState;
    }
}
interface ChessBoardProps{
    gameBoardState: Piece[]
}

export default function ChessBoard(gameState:ChessBoardProps):JSX.Element{
    const BOARD_SIZE = 8
    let board:React.ReactElement[] = []
    for(let i=1; i <= BOARD_SIZE; i++){
        for(let j= 1; j <= BOARD_SIZE;j++){
            board.push(<Tile TileX={i} TileY={j}/>)
        }
    }
    let pieces = gameState.gameBoardState
    for(let i=0;i<pieces.length;i++){
        let tileIdx = (pieces[i].posX-1)*8 + pieces[i].posY-1
        console.log(pieces[i].posX,pieces[i].posY,pieces[i].imageLink)
        board[tileIdx] = <Tile TileX={pieces[i].posX} TileY={pieces[i].posY} imageLink={pieces[i].imageLink}></Tile>
    }
    return <div className="ChessBoard" >
        {board}
    </div>
}
export {BoardState}