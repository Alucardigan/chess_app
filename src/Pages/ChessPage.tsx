
import { useNavigate, useParams } from "react-router-dom"
import ChessBoard from "../Components/Chessboard"
import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client";
import Chat from "../Components/Chat";
import { Badge, Box, Button, Container,Text, Flex, HStack, Heading, IconButton, Tooltip, useDisclosure,useMediaQuery,useToast } from "@chakra-ui/react";
import CheckmateDialogBox from "../Components/CheckmateDialogBox";
import StalemateDialogBox from "../Components/StalemateDialogBox";
import PromotionDialogBox from "../Components/PromotionDialogBox";
import { FaHome, FaFlag, FaComment } from "react-icons/fa";

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
    const { isOpen: isPromotionOpen, onOpen: onPromotionOpen, onClose: onPromotionClose } = useDisclosure()
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
    
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
            console.log(newBoardState.bitString)
            if(newBoardState.stalemate){
                console.log("Stalemate is on")
                onOpenStalemate()
            }
            if(newBoardState.checkmate===true){
                winnerRef.current = newBoardState.winner
                onOpenCheckmate()
            }
        })
        socketRef.current.on("promotionChoiceRequired",()=>{
            console.log("receivedpromotionrequest")
            onPromotionOpen()
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
            console.log(from,to)
            const userID = (sessionStorage.getItem("chessGameUserID"))
            socketRef.current.emit('movePiece',{gameID,userID: userID,from,to})
        }
    }
    const onPromotionSelect = (pieceIdx:number) =>{
        if(socketRef.current){
            console.log("promotion choice",pieceIdx)
            const userID = (sessionStorage.getItem("chessGameUserID"))
            socketRef.current.emit('promotionUpdate',{gameID,userID: userID,pieceIdx})
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
        <Container maxW="container.xl" p={4}>
            <Flex direction="column" align="center" mb={4}>
                <Heading size="md" mb={2}>Chess Game</Heading>
                <Badge colorScheme="blue" mb={3} fontSize="md">Game ID: {gameID}</Badge>
                <Text fontSize="sm" color="gray.500">
                    Playing as {isWhite ? 'White' : 'Black'}
                </Text>
            </Flex>
    
            <Flex 
            direction={isLargerThan800 ? "row" : "column"} 
            width="100%" 
            gap={6} 
            align="start"
            justify="center"
            >
            {/* Chess Board Container */}
            <Box 
                flex={isLargerThan800 ? 3 : "auto"}
                width={isLargerThan800 ? "auto" : "100%"}
                boxShadow="xl"
                borderRadius="md"
                overflow="hidden"
            >
                <ChessBoard 
                boardState={boardState} 
                isWhite={isWhite} 
                onMove={onMove} 
                />
            </Box>
    
            {/* Game Controls and Chat */}
                <Flex 
                    direction="column"
                    flex={isLargerThan800 ? 2 : "auto"}
                    width={isLargerThan800 ? "auto" : "100%"}
                    gap={4}
                >
                    {/* Game Controls */}
                    <Box 
                    bg="white" 
                    p={4} 
                    borderRadius="md" 
                    boxShadow="md"
                    width="100%"
                    >
                    <Heading size="sm" mb={3}>Game Controls</Heading>
                    <HStack spacing={3}>
                        <Tooltip label="Go Home">
                        <IconButton
                            aria-label="Go Home"
                            icon={<FaHome />}
                            onClick={goHome}
                        />
                        </Tooltip>
                        <Tooltip label="Offer Draw">
                        <IconButton
                            aria-label="Offer Draw"
                            icon={<FaFlag />}
                        />
                        </Tooltip>
                        <Tooltip label="Toggle Chat">
                        <IconButton
                            aria-label="Toggle Chat"
                            icon={<FaComment />}
                            display={{ base: 'flex', md: 'none' }}
                        />
                        </Tooltip>
                        <Button 
                        colorScheme="red" 
                        size="sm" 
                        variant="outline"
                        onClick={onOpenStalemate}
                        >
                        Resign
                        </Button>
                    </HStack>
                    </Box>
        
                    {/* Chat Box */}
                    <Box 
                    bg="white" 
                    borderRadius="md" 
                    boxShadow="md"
                    height={isLargerThan800 ? "400px" : "300px"}
                    width="100%"
                    display={{ base: isLargerThan800 ? 'block' : 'none', md: 'block' }}
                    >
                    {!isSocketConnected && <Box p={4}>Chat is loading</Box>}
                    {isSocketConnected && (
                        <Chat socketRef={socketRef.current} userID={userID} gameID={gameID} />
                    )}
                    </Box>
                </Flex>
            </Flex>
            {/* Dialog Boxes */}
            <CheckmateDialogBox 
                isOpen={isCheckmateOpen} 
                onClose={goHome} 
                winner={winnerRef.current} 
            />
            <StalemateDialogBox 
                isOpen={isStalemateOpen} 
                onClose={goHome} 
            />
            <PromotionDialogBox 
                isOpen={isPromotionOpen} 
                onClose={onPromotionClose} 
                onSelect={onPromotionSelect} 
                color="white" 
            />
        </Container>
  
    )

}
export default ChessPage;