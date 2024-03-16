import { ChakraBaseProvider } from "@chakra-ui/react";
import { RoomPage } from "./CreateRoomPage";

export function HomePage(){
    return (
    <div className="App">
        <ChakraBaseProvider>
            <RoomPage/>
        </ChakraBaseProvider>
      
      
    </div>
    );
}