import { Button,Box, Flex, Input, Grid, Heading, ButtonGroup } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SocketContext from "../Components/SocketContext";
import { json } from "stream/consumers";

export function RoomPage(){
    const {socket,setSocket} = useContext(SocketContext)
    const navigate = useNavigate();
    const [isWhite,setIsWhite] = useState(true);
    const [joinRoomId,setJoinRoomId] = useState('')
    //create room 
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

    return(
        <Box bg="gray.50" minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4}>
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" mb={8} width="100%" maxWidth="400px">
        <Heading as="h1" mb={8} textAlign="center" color="black">
          Create a room
        </Heading>
        <Grid templateColumns="1fr" gap={4} alignItems="center" justifyContent="center">
          <ButtonGroup variant="outline" spacing="6" justifyContent="center">
            <Button 
              isActive={isWhite}
              colorScheme="white"
              border="2px"
              borderColor="blue.500"
              color="blue.500"
              _hover={{ bg: "blue.50" }}
              _active={{ bg: "blue.100" }}
              onClick={()=>{setIsWhite(true)}}
            >
              White
            </Button>
            <Button 
              isActive={isWhite==false}
              colorScheme="black"
              border="2px"
              borderColor="blackAlpha.500"
              color="black.500"
              _hover={{ bg: "blackAlpha.50" }}
              _active={{ bg: "blackAlpha.100" }}
              onClick={()=>{setIsWhite(false)}}
            >
              Black
            </Button>
          </ButtonGroup>
          <Button
            bg="blue.500"
            color="white"
            border="2px"
            borderColor="blue.500"
            onClick={()=>{socket.emit('create-room',isWhite)}}
            size="md"
            gridColumn="span 1"
            mt={4}
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
          >
            Create Room
          </Button>
        </Grid>
      </Box>

      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" width="100%" maxWidth="400px">
        <Heading as="h1" mb={8} textAlign="center" color="black">
          Join a room
        </Heading>
        <Grid templateColumns="1fr" gap={4} alignItems="center" justifyContent="center">
          <Input
            size="md"
            value={joinRoomId}
            color="black"
            onChange={handleInputChange}
            placeholder="Enter Room ID"
          />
          <Button
            bg="blue.500"
            color="white"
            border="2px"
            borderColor="blue.500"
            onClick={joinRoom}
            size="md"
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
          >
            Join Room
          </Button>
        </Grid>
      </Box>
    </Box>
    );
}