import React from "react";
import './ChessBoard.css'
import Tile from "./Tile";



export default function ChessBoard(){
    const BOARD_SIZE = 8
    let board:React.ReactElement[] = []
    for(let i=1; i <= BOARD_SIZE; i++){
        for(let j= 1; j <= BOARD_SIZE;j++){
            board.push(<Tile TileX={i} TileY={j}/>)
        }
    }
    return <div className="ChessBoard">
        {board}
    </div>
}