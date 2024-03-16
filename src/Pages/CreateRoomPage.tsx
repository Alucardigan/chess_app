import { Button,Box } from "@chakra-ui/react";
import { createRoom } from "../Client-side/client";

export function RoomPage(){
    return(
        <div className="RoomCreationPage">
            <Box bg='teal' w='100%' p={4} color='white'>
                <Button colorScheme='teal' onClick={createRoom} size='xs'>Create Room</Button>
            </Box>
            
        </div>
    );
}