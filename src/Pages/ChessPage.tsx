
import { useParams } from "react-router-dom"
import ChessBoard from "../Components/Chessboard"
import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client";

function ChessPage(){
    //get the game state from game ID via request to backend
    const {gameID} = useParams()
    const [boardState,setBoardState] = useState("rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR")
    //socketReferences
    const socketRef = useRef<Socket|null>(null)
    useEffect(()=>{
        socketRef.current = io('http://localhost:8080')
        socketRef.current.on("connect",()=>{
            console.log('connected to backend',socketRef.current?.id)
        })
        socketRef.current.on("receiveGame",(newBoardState:string)=>{
            console.log(newBoardState)
            setBoardState(newBoardState)
        })
        return ()=> {
            socketRef.current?.disconnect()
            console.log('disconnected')
        };
    },[])
    //socket events 
    const onMove =(from:number,to:number)=>{
        if(socketRef.current){
            socketRef.current.emit('movePiece',{gameID,from,to})
        }

    }
    return (
    <div>{gameID}
        <div className="chessboard">
            <ChessBoard boardState={boardState} onMove={onMove}/>
        </div>
    </div>
    )

}
export default ChessPage;