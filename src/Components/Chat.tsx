import { Button, FormControl, Input, ListItem, UnorderedList } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import SocketContext from "./SocketContext";

export default function Chat(){
    let {socket,setSocket} = useContext(SocketContext)
    
    
    const [messages,setMessages] = useState<string[]>([])
    const [currentMessage,setCurrentMessage] = useState("");
    function handleInputChange(e:React.FormEvent<HTMLInputElement>){
        setCurrentMessage(e.currentTarget.value)
    }
    function sendMessage(){
        socket.emit('sendMessage',currentMessage)
        console.log('sent',messages)
        setCurrentMessage("");
    }
    
    useEffect(()=>{
        const receiveMsg = (message:string)=>{
            let newMessagesArray = [...messages]
            newMessagesArray.push(message)
            setMessages(newMessagesArray)
        }
        socket.on('connect',()=>{
            console.log("A user has joined chat")
        })
        socket.on('receiveMessage',receiveMsg)
        return ()=>{
            socket.off('receiveMessage')
        }
    },[socket])
    
    return(
        <div className="Chat">
            <UnorderedList>
                {messages.map((message)=><ListItem >{message}</ListItem>)}
            </UnorderedList>
            <FormControl>
                <Input value={currentMessage} onChange={handleInputChange}/>
                <Button  onClick={sendMessage}>Submit</Button>
            </FormControl>
        </div>
    )
}