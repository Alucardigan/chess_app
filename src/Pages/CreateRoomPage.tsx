import { Button,Box, Stack, Input } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SocketContext from "../Components/SocketContext";

export function RoomPage(){
    const {socket,setSocket} = useContext(SocketContext)
    const navigate = useNavigate();
    const [joinRoomId,setJoinRoomId] = useState('')
    //create room 
    function createRoom(){
        console.log("create a Room")
        socket.emit('create-room')
    }
    const handleInputChange=(e:React.FormEvent<HTMLInputElement>)=>{
        setJoinRoomId(e.currentTarget.value)
    }
    function joinRoom(){
        console.log('Navigating to board')
        navigate(`/chessboard/${joinRoomId}`)
    }
    socket.on("connect",()=>{
        console.log('connected to server')
    })
    socket.on('room-created',(roomId)=>{
        console.log(roomId)
        navigate(`/chessboard/${roomId}`)
    });
    socket.on('join-room',(roomId)=>{
        console.log(roomId)
        navigate(`/chessboard/${roomId}`)
    })
    

    return(
        <div className="RoomCreationPage">
            <Stack bg='teal' w='100%' p={4} color='white'>
                <Button colorScheme="blue" onClick={createRoom} size='md'>Create Room</Button>
                <Input size='md' value= {joinRoomId} color={'black'} onChange={handleInputChange} />
                <Button onClick={joinRoom} size='md'>Join Room</Button>
            </Stack>
            
        </div>
    );
}