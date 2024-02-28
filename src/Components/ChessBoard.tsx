import React, { useEffect, useState,MouseEvent, useRef, useMemo} from "react";
import './ChessBoard.css'
import Tile from "./Tile";
import { WhitePlayer,BlackPlayer, Player } from "../Game-classes/Player";
import { useContext } from "react";
import GameContext from "../Game-classes/GameContext";
import { cloneGame } from "../Game-classes/Game";
import { Piece } from "../Game-classes/Piece";

interface Square{
    x:number,
    y:number,
    cookie:number,
    piece: Piece|undefined;
}

export default function ChessBoard():JSX.Element{
    function intialBoardSetup(){
        console.log('setup')
        const BOARD_SIZE = 8
        let intialBoard = []
        for(let i=1; i <= BOARD_SIZE; i++){
            for(let j= 1; j <= BOARD_SIZE;j++){
                intialBoard.push({x:i,y:j,cookie:intialBoard.length,piece:undefined})
            }
        }
        let pieces = gameState.currentBoardState;
        for(let i=0;i<pieces.length;i++){
            let tileIdx = (pieces[i].posX-1)*8 + pieces[i].posY-1
            intialBoard[tileIdx] = {x:pieces[i].posX,y:pieces[i].posY,cookie:tileIdx,piece:pieces[i]}
        }
        
        return intialBoard;
    }
    
    const {gameState,setGameState} = useContext(GameContext);
    let selectedPiece = useRef<number|null>(null);
    
    let [board,setBoard] = useState<Square[]>(intialBoardSetup());
    
    function handleClick(e:MouseEvent,key:number){
        if(selectedPiece.current!== null){
            let newBoard = [...board]
            let FromTile = newBoard[selectedPiece.current];
            let ToTile = newBoard[key]; 
            ToTile.piece = FromTile.piece;
            FromTile.piece = undefined;
            console.log(newBoard)
            selectedPiece.current = null;
            setBoard(newBoard)
            return 

        }
        //board[key] space we click, selectedPiece space we clicked
        if(selectedPiece.current === null&&board[key].piece !== null){
            selectedPiece.current = key
            console.log(selectedPiece)
            return
        }
        
    }
    
        
    return <div id="ChessBoard"  className="ChessBoard" >
        
        {board.map((tileObj) => <Tile TileX={tileObj.x} TileY={tileObj.y} piece={tileObj.piece} cookie={tileObj.cookie} mouseHandler={handleClick}></Tile>)}
    </div>
}
