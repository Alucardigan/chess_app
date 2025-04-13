
import { useParams } from "react-router-dom"
import ChessBoard from "../Components/Chessboard"
import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client";
import Chat from "./Chat";
import { HStack } from "@chakra-ui/react";
interface ChatMessageFormat{
    username : string 
    message : string 
}
function ChessPage(){
    //get the game state from game ID via request to backend
    const {gameID} = useParams()
    const userID = (sessionStorage.getItem("chessGameUserID"))
    if(!userID){
        console.log("ERROR: userID doesnt exist")
    }
    const [boardState,setBoardState] = useState<string>("rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR")
    const [chatState,setChatState] = useState<string[]>();
    //socketReferences
    const socketRef = useRef<Socket|null>(null)
    useEffect(()=>{
        socketRef.current = io('http://localhost:8080')
        socketRef.current.on("connect",()=>{
            console.log('connected to backend',socketRef.current?.id)
            socketRef.current?.emit("joinGame",{gameID,userID: userID})
        })
        socketRef.current.on("receiveGame",(newBoardState:{bitString: string,checkmate: boolean , winner : string })=>{
            console.log(newBoardState)
            setBoardState(newBoardState.bitString)
        })
        return ()=> {
            socketRef.current?.disconnect()
            console.log('disconnected')
        };
    },[])
    //socket events 
    const onMove =(from:number,to:number)=>{
        if(socketRef.current){
            const userID = (sessionStorage.getItem("chessGameUserID"))
            socketRef.current.emit('movePiece',{gameID,userID: userID,from,to})
        }
    }
    return (
    <div>{gameID}
            <HStack>
            <div className="chessboard">
                <ChessBoard boardState={boardState} onMove={onMove}/>
            </div>
            <div className="chatBar">
                <Chat socketRef={socketRef} userID={userID} gameID={gameID}></Chat>
            </div>
        </HStack>
    </div>
    )

}
export default ChessPage;