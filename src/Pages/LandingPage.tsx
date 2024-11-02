import { Button, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage(){
  const [nameString, setNameString] = useState("");
  const navigator = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameString !== "") {
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameString(e.target.value);
  };

  const createGame = async () =>{
    console.log("creating game",import.meta.env)
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_TARGET}/api/game/AI`,{
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
    const gameID = data.id
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
      <div id="joinCard"><Button onClick={createGame}>Play Against AI </Button></div>
      <div id="joinCard"><Button>Join a game</Button></div>
      <div id="joinCard"><Button>Create a lobby</Button></div>
    </div>
  );
}

export default LandingPage;