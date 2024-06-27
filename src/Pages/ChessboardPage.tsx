import { useContext, useEffect, useState } from "react";
import ChessBoard from "../Components/ChessBoard";

import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Chat from "../Components/Chat";
import { Button, Flex, Spacer, Stack } from "@chakra-ui/react";

import SocketContext from "../Components/SocketContext";


export function ChessBoardPage(){
    const {socket,setSocket} = useContext(SocketContext)
    let {roomId} = useParams<{roomId:string}>()
    useEffect(()=>{
        socket.on('send-color',(color)=>{
            if(!socket.id){
                console.log("ERROR socket id undefined")
                return  
              }
            console.log(color,"socket color",socket.id)
            localStorage.setItem(socket.id,JSON.stringify({color}))
        })
        socket.emit('join-room',roomId)
    },[socket])
    
    
    console.log('a user joined a game') 
    return(
        <div className="ChessBoardPage">
            <Flex>
                <ChessBoard/>
                <Spacer/>
                <Chat/>
                
            </Flex>
        </div>
    )
}