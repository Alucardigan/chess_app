import { Button, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
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
    localStorage.setItem("chessGameUserID",userID)
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
    localStorage.setItem("chessGameUserID",userID)
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

  return (
    <div id="LandingPage"> 
      Chess Game 
      <div id="joinCard"><Button onClick={async () =>{createGame("AI")}}>Play Against AI </Button></div>
      <label>{joinCode}</label>
      <div id="joinCard">
        <form onSubmit={joinGame}>
          <FormControl>
            <FormLabel>Enter a code and join</FormLabel>
            <Input value={joinCode} onChange={(e)=>setJoinCode(e.target.value) }/>
            <FormHelperText></FormHelperText>
          </FormControl>
          <Button
            mt={4}
            colorScheme='teal'
            type='submit'
          >
            Join Game
          </Button>
        </form>
      </div>
      <div id="joinCard"><Button onClick={async () =>{createGame("playerGame")}}>Create a lobby</Button></div>
    </div>
  );
}

export default LandingPage;