import React, { useEffect, useState,MouseEvent, useRef, useMemo} from "react";
import './ChessBoard.css'
import Tile from "./Tile";
import { WhitePlayer,BlackPlayer, Player } from "../Game-classes/Player";
import { useContext } from "react";
import GameContext from "../Game-classes/GameContext";
import { cloneGame } from "../Game-classes/Game";
import { Piece } from "../Game-classes/Piece";
import { MarchAction } from "../Game-classes/Actions";

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
                let squareObj:Square = {x:i,y:j,cookie:intialBoard.length,piece:undefined}
                intialBoard.push(squareObj);
            }
        }
        
        
        return intialBoard;
    }
    
    const {gameState,setGameState} = useContext(GameContext);
    let selectedPiece = useRef<number|null>(null);
    
    let [board,setBoard] = useState<Square[]>(intialBoardSetup);//shouldnt call the function, react calls the function for us. Calling it will cause it to be called in every re render
    useEffect(()=>{
        let newBoard = intialBoardSetup();
        let pieces = gameState.currentBoardState;
        for(let i=0;i<pieces.length;i++){
            let tileIdx = (pieces[i].posX-1)*8 + pieces[i].posY-1
            let squareObj:Square = {x:pieces[i].posX,y:pieces[i].posY,cookie:tileIdx,piece:pieces[i]}
            newBoard[tileIdx] = squareObj;
        }
        setBoard(newBoard);
    },[gameState.currentBoardState])
    function handleClick(e:MouseEvent,key:number){
        let player = gameState.players[gameState.determinePlayer()];//get the player whose turn it is 
        
        if(selectedPiece.current!== null){//if there is a selected piece
            
            let sPiece = board[selectedPiece.current].piece;
            if(!sPiece){return}
            let newGameState = cloneGame(gameState);
            let foundPiece = newGameState.currentBoardState.find((piece:Piece)=>piece.posX===sPiece?.posX && piece.posY===sPiece?.posY)
            if(!foundPiece){return}
            foundPiece.posX = board[key].x;
            foundPiece.posY = board[key].y;
            console.log()
            if(sPiece.constructor.name==="Pawn"){sPiece.move(newGameState.currentBoardState,board[key].x,board[key].y)}
            newGameState.turns += 1;
            setGameState(newGameState);
            selectedPiece.current = null;
            return 

        }
        //board[key] space we click, selectedPiece space we clicked
        if(selectedPiece.current === null&&board[key].piece !== null){//if there is no selected piece and we have clicked a piece
            if(board[key].piece?.color === player.color){//do they match our color 
                selectedPiece.current = key;
                
            }
            else{
                console.log("Not your piece")
            }
            
            return
        }
        
    }
    
        
    return <div id="ChessBoard"  className="ChessBoard" >
        
        {board.map((tileObj) => <Tile TileX={tileObj.x} TileY={tileObj.y} piece={tileObj.piece} cookie={tileObj.cookie} mouseHandler={handleClick}></Tile>)}
    </div>
}
