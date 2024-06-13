import { useContext, useState } from "react";
import ChessBoard from "../Components/ChessBoard";

import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Chat from "../Components/Chat";
import { Button, Flex, Spacer, Stack } from "@chakra-ui/react";

import SocketContext from "../Components/SocketContext";


export function ChessBoardPage(){
    function startGame(){
        console.log("requested for game to start")
        socket.emit('startGame',roomId)
    }
    const {socket,setSocket} = useContext(SocketContext)
    let {roomId} = useParams<{roomId:string}>()
    socket.emit('join-room',roomId)
    socket.on('send-color',(color)=>{
        if(!socket.id){
            console.log("ERROR socket id undefined")
            return  
          }
        localStorage.setItem(socket.id,JSON.stringify({color}))
    })
    console.log('a user joined a game') 
    return(
        <div className="ChessBoardPage">
            <Flex>
                <ChessBoard/>
                <Spacer/>
                <Chat/>
                <Button onClick={startGame}>Start Game</Button>
            </Flex>
        </div>
    )
}