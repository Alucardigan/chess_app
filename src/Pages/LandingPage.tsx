import { Button, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

function LandingPage(){
  const [nameString, setNameString] = useState("");
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
      <div id="joinCard"><Button>Play Against AI </Button></div>
      <div id="joinCard"><Button>Join a game</Button></div>
      <div id="joinCard"><Button>Create a lobby</Button></div>
    </div>
  );
}

export default LandingPage;