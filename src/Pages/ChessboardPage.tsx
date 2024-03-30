import { useContext, useState } from "react";
import ChessBoard from "../Components/ChessBoard";
import GameContext from "../Game-classes/GameContext";
import { Game } from "../Game-classes/Game";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Chat from "../Components/Chat";
import { Flex, Spacer, Stack } from "@chakra-ui/react";

import SocketContext from "../Components/SocketContext";

export function ChessBoardPage(){
    const {socket,setSocket} = useContext(SocketContext)
    let {roomId} = useParams<{roomId:string}>()
    socket.emit('join-room',roomId)
    console.log('a user joined a game')

    let [gameState,setGameState] = useState(new Game()) 
    return(
        <div className="ChessBoardPage">
            <GameContext.Provider value={{gameState,setGameState}}>
                    <Flex>
                        <ChessBoard/>
                        <Spacer/>
                        <Chat/>
                    </Flex>
            </GameContext.Provider>
        </div>
    )
}