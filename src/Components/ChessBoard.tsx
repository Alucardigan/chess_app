import React, { useEffect, useState,MouseEvent, useRef, useMemo} from "react";
import './ChessBoard.css'
import Tile from "./Tile";
import { useContext } from "react";
import SocketContext from "./SocketContext";
import {GameFormat,PieceFormat,MoveRequest, MoveResponse} from '../../shared/gameRequests'

interface Square{
    x:number,
    y:number,
    cookie:number,
    piece:string|undefined
    isSelected: boolean
}
function cloneBoard(board:[]){
    let newBoard:Square[] = []
    for(let i = 0; i < board.length;i++){
        newBoard.push(board[i])
    }
    return newBoard
}

export default function ChessBoard():JSX.Element{    
    //socket listener that updates game
    const {socket,setSocket} = useContext(SocketContext);
    const [isWhite,setColor] = useState(true)
    const [selectedPiece,setSelectedPiece] = useState<number>();//null is used here as it is explicit and clear unlike undefined 

    //board setup
    let [board,setBoard] = useState<Square[]>(intialBoardSetup);//shouldnt call the function, react calls the function for us. Calling it will cause it to be called in every re render

    //socket listener
    useEffect(()=>{
        const receiveGame =(moveRes:MoveResponse)=>{
            console.log(moveRes)
            setColor(moveRes.playerColor)
            const newGame = moveRes.gameFormat;
            let newBoard = intialBoardSetup()
            for(let i =0; i< newGame.pieces.length;i++){
                let piece:PieceFormat = newGame.pieces[i]
                if(isWhite==false){
                    piece.positionX = -piece.positionX + 9
                    piece.positionY = -piece.positionY +9
                }
                let squareIdx = newBoard.findIndex((s)=>{return (s.x === piece.positionX) && (s.y === piece.positionY)})//if you use curly braces, YOU NEED TO RETURN 
                newBoard[squareIdx].piece = piece.fileName;
            }
            setBoard(newBoard)//re render the board
        }
        socket.on('receiveGame',receiveGame)//change gamestate when gettign a game back
        return ()=>{socket.off()}//removing listener to stop spam
    },[socket,isWhite])    
    
    //intial board setup 
    function intialBoardSetup(){//function to setup our board
        console.log('setup')
        const BOARD_SIZE = 8
        let intialBoard = []
        for(let i=1; i <= BOARD_SIZE; i++){
            for(let j= 1; j <= BOARD_SIZE;j++){
                let squareObj:Square = {x:i,y:j,cookie:intialBoard.length,piece:undefined,isSelected:false}
                intialBoard.push(squareObj);
            }
        }
        return intialBoard;
    }
    
    
    function handleClick(e:MouseEvent,key:number){ 
        console.log(selectedPiece,key)
        if(selectedPiece){//if there is a selected piece
            let mr:MoveRequest = {pieceX: board[selectedPiece].x,pieceY:board[selectedPiece].y,newX:board[key].x,newY:board[key].y}
            if(isWhite===false){
                mr = {pieceX: -board[selectedPiece].x+9,pieceY:-board[selectedPiece].y+9,newX:-board[key].x+9,newY:-board[key].y+9}
            }
            
            socket.emit('moveRequest',mr)
            console.log(selectedPiece)
            setSelectedPiece(undefined)
            return 
        }
        //board[key] space we click, selectedPiece space we clicked
        if(!selectedPiece &&board[key].piece !== undefined){//if there is no selected piece and we have clicked a piece 
            console.log(key)
            setSelectedPiece(key);
        }
        
    }
    
        
    return <div id="ChessBoard"  className="ChessBoard" >
        
        {board.map((tileObj) => <Tile TileX={tileObj.x} TileY={tileObj.y} piece={tileObj.piece} cookie={tileObj.cookie} isSelected={tileObj.cookie===selectedPiece} mouseHandler={handleClick}></Tile>)}
    </div>
}
