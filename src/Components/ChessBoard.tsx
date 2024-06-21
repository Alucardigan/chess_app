import React, { useEffect, useState,MouseEvent, useRef, useMemo} from "react";
import './ChessBoard.css'
import Tile from "./Tile";
import { useContext } from "react";
import SocketContext from "./SocketContext";
import {GameFormat,PieceFormat,MoveRequest} from '../../shared/gameRequests'

interface Square{
    x:number,
    y:number,
    cookie:number,
    piece:string|undefined
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

    //board setup
    let [board,setBoard] = useState<Square[]>(intialBoardSetup);//shouldnt call the function, react calls the function for us. Calling it will cause it to be called in every re render

    //socket listener
    useEffect(()=>{
        const receiveGame =(newGame:GameFormat)=>{
            let newBoard = intialBoardSetup()
            if(socket.id){
                console.log(localStorage.getItem(socket.id))
                const getData = localStorage.getItem(socket.id)
                if(getData){
                    console.log(JSON.parse(getData).color)
                    setColor(JSON.parse(getData).color===true)
                }
                
            }
            for(let i =0; i< newGame.pieces.length;i++){
                let piece:PieceFormat = newGame.pieces[i]
                if(!isWhite){
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
    },[socket])    
    
    //intial board setup 
    function intialBoardSetup(){//function to setup our board
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
    
    let selectedPiece = useRef<number|null>(null);//null is used here as it is explicit and clear unlike undefined 
    function handleClick(e:MouseEvent,key:number){ 
        console.log(selectedPiece,key)
        if(selectedPiece.current!== null){//if there is a selected piece
            let mr:MoveRequest = {pieceX: board[selectedPiece.current].x,pieceY:board[selectedPiece.current].y,newX:board[key].x,newY:board[key].y}
            if(isWhite===false){
                mr = {pieceX: -board[selectedPiece.current].x+9,pieceY:-board[selectedPiece.current].y+9,newX:-board[key].x+9,newY:-board[key].y+9}
            }
            
            console.log('Sending move ',isWhite)
            socket.emit('moveRequest',mr)
            selectedPiece.current = null
            return 
        }
        //board[key] space we click, selectedPiece space we clicked
        if(selectedPiece.current === null&&board[key].piece !== undefined){//if there is no selected piece and we have clicked a piece 
            selectedPiece.current = key;
            console.log(selectedPiece,key)
        }
        
    }
    
        
    return <div id="ChessBoard"  className="ChessBoard" >
        
        {board.map((tileObj) => <Tile TileX={tileObj.x} TileY={tileObj.y} piece={tileObj.piece} cookie={tileObj.cookie} mouseHandler={handleClick}></Tile>)}
    </div>
}
