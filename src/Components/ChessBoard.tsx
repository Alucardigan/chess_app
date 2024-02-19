import React from "react";
import './ChessBoard.css'
import Tile from "./Tile";
import { WhitePlayer,BlackPlayer } from "../Game-classes/Player";



export default function ChessBoard(){
    const BOARD_SIZE = 8
    let board:React.ReactElement[] = []
    for(let i=1; i <= BOARD_SIZE; i++){
        for(let j= 1; j <= BOARD_SIZE;j++){
            board.push(<Tile TileX={i} TileY={j}/>)
        }
    }
    let playerWhite = new WhitePlayer()
    let playerBlack = new BlackPlayer()
    let pieces = playerWhite.pieces.concat(playerBlack.pieces)
    for(let i=0;i<pieces.length;i++){
        let tileIdx = (pieces[i].posX-1)*8 + pieces[i].posY-1
        console.log(pieces[i].posX,pieces[i].posY,pieces[i].imageLink)
        board[tileIdx] = <Tile TileX={pieces[i].posX} TileY={pieces[i].posY} imageLink={pieces[i].imageLink}></Tile>
    }
    return <div className="ChessBoard" >
        {board}
    </div>
}