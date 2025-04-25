import { Box, Button, Container, Divider, FormControl, FormHelperText, FormLabel, Heading, Input, VStack,Text, useColorModeValue } from "@chakra-ui/react";
import { join } from "path";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage(){
  const [nameString, setNameString] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const navigator = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameString !== "") {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameString(e.target.value);
  };
  const createGame = async (type:String) =>{
    
    console.log("creating game",import.meta.env)
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_TARGET}/api/game/${type}`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        userName: nameString,
        gameType: 0,
      })
    })
    const data = await response.json()
    const gameID = data.gameID
    const userID = data.userID
    sessionStorage.setItem("chessGameUserID",userID)
    sessionStorage.setItem("chessGameGameColor","white")
    console.log(`/game/${gameID}`,data)
    navigator(`/game/${gameID}`)
  }
  const joinGame = async (e:React.FormEvent<HTMLFormElement>) =>{
    //this is necessary because default form submission reloads the page which messes with react states
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_BACKEND_TARGET}/api/game/joinGame`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        userName: nameString,
        gameType: 0,
        joinCode: joinCode
      })
    })
    const data = await response.json()
    const gameID = data.gameID
    const userID = data.userID
    sessionStorage.setItem("chessGameUserID",userID)
    sessionStorage.setItem("chessGameGameColor","black")
    console.log(`/game/${gameID}`,data)
    navigator(`/game/${gameID}`)
  }
  if (!isSubmitted) {
    return (
      <div id="LandingPage">
        Chess Game
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Enter name</FormLabel>
            <Input value={nameString} onChange={handleChange} />
            <FormHelperText></FormHelperText>
          </FormControl>
          <Button
            mt={4}
            colorScheme='teal'
            type='submit'
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.md" p={5}>
      <VStack 
        spacing={8} 
        align="center" 
        bg={bgColor} 
        borderRadius="lg" 
        p={8} 
        boxShadow="lg"
      >
        <VStack spacing={2}>
          <Heading size="xl">Chess Game</Heading>
          <Text fontSize="lg" color="gray.500">By Thejas </Text>
        </VStack>
        
        <Divider />
        
        <VStack spacing={6} w="full">
          <Box 
            w="full" 
            p={6} 
            bg={cardBg} 
            borderRadius="md" 
            borderWidth="1px" 
            borderColor={borderColor}
            transition="transform 0.3s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          >
            <VStack>
              <Heading size="md">Play Now</Heading>
              <Button 
                colorScheme="blue" 
                size="lg" 
                w="full"
                onClick={() => createGame("AI")}
              >
                Challenge AI
              </Button>
              <Button 
                colorScheme="green" 
                size="lg" 
                w="full"
                onClick={() => createGame("playerGame")}
              >
                Create a Lobby
              </Button>
            </VStack>
          </Box>
          
          <Box 
            w="full" 
            p={6} 
            bg={cardBg} 
            borderRadius="md" 
            borderWidth="1px" 
            borderColor={borderColor}
          >
            <form onSubmit={joinGame}>
              <VStack spacing={4}>
                <Heading size="md">Join Existing Game</Heading>
                <FormControl>
                  <FormLabel>Enter Game Code</FormLabel>
                  <Input 
                    value={joinCode} 
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter code here"
                  />
                </FormControl>
                <Button
                  colorScheme="teal"
                  type="submit"
                  w="full"
                >
                  Join Game
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
        
        {joinCode && (
          <Text>Your game code: <Text as="span" fontWeight="bold">{joinCode}</Text></Text>
        )}
      </VStack>
    </Container>
  );
}

export default LandingPage;