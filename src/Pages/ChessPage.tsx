
import { useNavigate, useParams } from "react-router-dom"
import ChessBoard from "../Components/Chessboard"
import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client";
import Chat from "../Components/Chat";
import { Box, Flex, HStack, useDisclosure } from "@chakra-ui/react";
import CheckmateDialogBox from "../Components/CheckmateDialogBox";
interface ChatMessageFormat{
    username : string 
    message : string 
}
function ChessPage(){
    //get the game state from game ID via request to backend
    const {gameID} = useParams()
    const userID = (sessionStorage.getItem("chessGameUserID"))
    if(!userID){
        console.log("ERROR: userID doesnt exist")
    }
    const navigator = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [boardState,setBoardState] = useState<string>("rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR")
    const [chatState,setChatState] = useState<string[]>();
    const winnerRef = useRef<string>("");
    const [isWhite, setIsWhite] = useState(sessionStorage.getItem("chessGameGameColor")==="white"?true:false);
    //socketReferences
    const socketRef = useRef<Socket|null>(null)
    const [isSocketConnected,setIsSocketConnected] = useState(false)
    useEffect(()=>{
        socketRef.current = io('http://localhost:8080')
        socketRef.current.on("connect",()=>{
            console.log('connected to backend',socketRef.current?.id)
            socketRef.current?.emit("joinGame",{gameID,userID: userID})
            setIsSocketConnected(true)
        })
        socketRef.current.on("receiveGame",(newBoardState:{bitString: string,checkmate: boolean , winner : string })=>{
            console.log('new GameState',newBoardState,newBoardState.checkmate)
            setBoardState(newBoardState.bitString)
            
            if(newBoardState.checkmate===true){

                winnerRef.current = newBoardState.winner
                onOpen()
                console.log("isopen",isOpen)
            }
        })
        return ()=> {
            socketRef.current?.disconnect()
            console.log('disconnected')
        };
    },[])
    //socket events 
    const onMove =(from:number,to:number)=>{
        if(socketRef.current){
            const userID = (sessionStorage.getItem("chessGameUserID"))
            socketRef.current.emit('movePiece',{gameID,userID: userID,from,to})
        }
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
            <CheckmateDialogBox isOpen = {isOpen} onClose={goHome} winner={winnerRef.current}/>
            <Box flex={1} width={"200px"}>
                {!isSocketConnected && <div>Chat is loading</div>}
                {isSocketConnected && <Chat socketRef={socketRef.current} userID={userID} gameID={gameID}></Chat>}
            </Box>
        </Flex>
    </div>
    )

}
export default ChessPage;