import { VStack,Text, HStack, Input, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
interface ChatProps{
    socketRef : React.MutableRefObject<Socket| null>,
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
    const [chatState,setChatState] = useState<ChatMessageFormat[]>([{username:"Game Admin",chatMessage: "Welcome to the game of chess"},{username: "User1",chatMessage: "Thanks for the invite"}])
    const [currentMessage,setCurrentMessage] = useState("")
    useEffect(()=>{
        socketRef.current?.on("receiveChatMessage",(newChatState:{chatMessages: ChatMessageFormat[]})=>{
            console.log("client received message",newChatState)
            setChatState(newChatState.chatMessages)
        })
        return ()=> {
            socketRef.current?.off()
            console.log('chat disconnected')
        };
    },[socketRef.current])
    const onSendMessage=(message:String)=>{
        console.log("SENT MESSAGE")
        socketRef.current?.emit("sendChatMessage",{gameID,userID,message})
        setCurrentMessage("")
    }
    return (
        <div className = "chat">
            <div className = "chat window">
            <VStack>
                    {
                        chatState.map((chatMessage:ChatMessageFormat)=>{
                            return <Message username={chatMessage.username} chatMessage={chatMessage.chatMessage}></Message>
                        })
                    }
                </VStack>
            </div>
            <div className = "chatInputBox">
                <HStack p={4} bg="gray.100">
                    <Input bg="white" placeholder="Enter your text" onKeyUp={(e)=>{if(e.key=='Enter'){onSendMessage(currentMessage)}}} onChange={(e)=>{setCurrentMessage(e.currentTarget.value)}} />
                    <Button colorScheme="blue"  onClick={()=>onSendMessage(currentMessage)}>Send</Button>
                </HStack>
            </div>
        </div>
    );
}
export default Chat