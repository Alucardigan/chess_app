
import { useNavigate, useParams } from "react-router-dom"
import ChessBoard from "../Components/Chessboard"
import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client";
import Chat from "../Components/Chat";
import { Box, Button, Flex, useDisclosure,useToast } from "@chakra-ui/react";
import CheckmateDialogBox from "../Components/CheckmateDialogBox";
import StalemateDialogBox from "../Components/StalemateDialogBox";

function ChessPage(){
    //get the game state from game ID via request to backend
    const {gameID} = useParams()
    const userID = (sessionStorage.getItem("chessGameUserID"))
    if(!userID){
        console.log("ERROR: userID doesnt exist")
    }
    const navigator = useNavigate()

    const { isOpen: isCheckmateOpen, onOpen: onOpenCheckmate, onClose: onCloseCheckmate } = useDisclosure()
    const { isOpen: isStalemateOpen, onOpen: onOpenStalemate, onClose: onCloseStalemate } = useDisclosure()
    const [boardState,setBoardState] = useState<string>("rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR")
    const winnerRef = useRef<string>("");
    const [isWhite, setIsWhite] = useState(sessionStorage.getItem("chessGameGameColor")==="white"?true:false);
    //socketReferences
    const socketRef = useRef<Socket|null>(null)
    const [isSocketConnected,setIsSocketConnected] = useState(false)
    const toast = useToast()
    useEffect(()=>{
        socketRef.current = io('http://localhost:8080')
        socketRef.current.on("connect",()=>{
            console.log('connected to backend',socketRef.current?.id)
            socketRef.current?.emit("joinGame",{gameID,userID: userID})
            setIsSocketConnected(true)
        })
        socketRef.current.on("receiveGame",(newBoardState:{bitString: string,checkmate: boolean , stalemate : boolean ,winner : string , })=>{
            setBoardState(newBoardState.bitString)
            if(newBoardState.stalemate){
                console.log("Stalemate is on")
                onOpenStalemate()
            }
            if(newBoardState.checkmate===true){
                winnerRef.current = newBoardState.winner
                onOpenCheckmate()
            }
        })
        socketRef.current.on("receiveError",(title:string,message:string)=>{
            onError(title,message)
        })
        return ()=> {
            socketRef.current?.disconnect()
        };
    },[])
    //socket events 
    const onMove =(from:number,to:number)=>{
        if(socketRef.current){
            const userID = (sessionStorage.getItem("chessGameUserID"))
            socketRef.current.emit('movePiece',{gameID,userID: userID,from,to})
        }
    }
    const onError= (title:string,description:string) =>{
        
        toast({
        title: title,
        description: description,
        status: 'error',
        duration: 2500,
        isClosable: true,
        })
    }
    //game over events
    const goHome = () =>{
        navigator("/")
    }

    return (
    <div>{gameID}
        
        <Flex width={"100%"} gap={0}>
            <Box flex={4} justifyContent={"center"}>
                <ChessBoard boardState={boardState} isWhite= {isWhite}onMove={onMove}/>
            </Box>
            <Button onClick={onOpenStalemate}>Stalemate</Button>
            <CheckmateDialogBox isOpen = {isCheckmateOpen} onClose={goHome} winner={winnerRef.current}/>
            <StalemateDialogBox isOpen = {isStalemateOpen} onClose={goHome}/>
            <Box flex={1} width={"200px"}>
                {!isSocketConnected && <div>Chat is loading</div>}
                {isSocketConnected && <Chat socketRef={socketRef.current} userID={userID} gameID={gameID}></Chat>}
            </Box>
        </Flex>
    </div>
    )

}
export default ChessPage;