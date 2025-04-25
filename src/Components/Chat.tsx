import { VStack,Text, HStack, Input, Button, Flex, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
interface ChatProps{
    socketRef : Socket| null,
    gameID: string|undefined, 
    userID: string |null
}
interface ChatMessageFormat{
    username : string 
    chatMessage : string 
}
const Message = ({ username, chatMessage }: ChatMessageFormat) => {
    return (
      <Flex
        p={1}
        bg='gray.100'
        color='gray.600'
        w="fit-content"
        alignSelf='flex-start'
      >
        <Text>{username}: {chatMessage}</Text>
      </Flex>
    );
  };
function Chat({socketRef, gameID, userID}:ChatProps){
    const [chatState,setChatState] = useState<ChatMessageFormat[]>([])
    const [currentMessage,setCurrentMessage] = useState("")
    useEffect(()=>{
        if(!socketRef){
            console.log("Socket in chat is undefined")
            return 
        }
        const handleReceiveChatMessage = (newChatState:{chatMessages: ChatMessageFormat[]})=>{
            setChatState(newChatState.chatMessages)
        }
        socketRef?.on("receiveChatMessage",handleReceiveChatMessage)
        if(socketRef?.connected){
            socketRef.on("connect",()=>{
                console.log("Chat is connected")
            })
        }
        return () =>{
            socketRef.off("receiveChatMessage")
        }
    },[socketRef])
    const onSendMessage=(message:String)=>{
        socketRef?.emit("sendChatMessage",{gameID,userID,message})
        setCurrentMessage("")
    }
    return (
        <Flex direction={"column"} height={"100%"} width ={"100%"}>
            <Box flex="1" overflowY={"auto"} mb={2}p={2}>
                <VStack spacing={2} align={"stretch"}>{
                        chatState.map((chatMessage:ChatMessageFormat,idx)=>{
                            return <Message key = {idx} username={chatMessage.username} chatMessage={chatMessage.chatMessage}></Message>
                        })}
                </VStack>
            </Box>
            <Box mt={"auto"}>
                <HStack p={3} bg="gray.100" borderRadius={"md"}>
                    <Input value={currentMessage} bg="white" placeholder="Enter your text" 
                    onKeyUp={(e)=>{if(e.key=='Enter'){onSendMessage(currentMessage)}}} 
                    onChange={(e)=>{setCurrentMessage(e.currentTarget.value)}} 
                    />
                    <Button colorScheme="blue"  onClick={()=>onSendMessage(currentMessage)}>Send</Button>
                </HStack>
            </Box>
           
        </Flex>
       
    );
}
export default Chat