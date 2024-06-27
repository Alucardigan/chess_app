import { createServer } from 'node:http';
import {Server, Socket} from 'socket.io'
import Game, { gameFunction } from './Game-classes/Game'
import {GameFormat,PieceFormat,MoveRequest,exportToGF,MoveResponse}  from '../shared/gameRequests'
import { Player } from './Game-classes/Player';





const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 8080
server.listen(PORT, () => {
  console.log('server running at http://localhost:8080');
});

let rooms = new Map<string,roomFormat>()

const generateRoomId = ()=>{
  return Math.floor(Math.random()*1000000)
}
function reportError(socket:Socket,roomId:string, errorMsg:string){
  socket.emit('ERROR',errorMsg)
}
io.on('connection',(socket)=>{
  //creating a room
  socket.on('create-room',(isWhite)=>{
      
      const roomID = generateRoomId().toString()
      const newPlayer:playerFormat = {socketId:socket.id,color:isWhite} 
      const playerArray:playerFormat[] = [newPlayer]
      rooms.set(roomID, {roomId:roomID,players:playerArray,game:undefined,messages:[]})
      socket.emit('room-created',roomID)
  })

  //joining a room
  socket.on('join-room',(roomId)=>{
    if(rooms.has(roomId)){
      let players = rooms.get(roomId)?.players
      if(players === undefined){return}
      let isWhite = true;
      if(!players.find((player)=> player.socketId === socket.id)){
        let isWhite = players[0].color ? false : true
        players.push({socketId:socket.id, color: isWhite})
      }
      else{
        isWhite = players.find((player)=> player.socketId === socket.id)?.color??isWhite
      }
      socket.join(roomId)
      socket.emit('send-color',isWhite)
      if(players.length ==2){183788
        startGame()
      }
    }
    else{
      console.log("room doesnt exist")
    }
    
  })
  //chat functions 
  socket.on('sendMessage',(message)=>{
    let roomId = findPlayer(socket.id,rooms)
    if(roomId){
      io.to(`${roomId}`).emit('receiveMessage',message)
    }
          
    
  })

  //chess functions 
  const startGame=()=>{
    
    let roomId = findPlayer(socket.id,rooms)
    
    let newGame = new Game();
    newGame.intialiseBoardState()
    if(roomId){
      let roomObj = rooms.get(roomId)
      if(!roomObj){
        console.log("ERROR")
        return
      }
      roomObj.game = newGame
      let gf = exportToGF(newGame)
      for(let i = 0; i< roomObj.players.length; i++){
        const player = roomObj.players[i]
        const moveResponse:MoveResponse = {gameFormat: gf,playerColor:player.color} 
        io.to(player.socketId).emit('receiveGame',moveResponse)
      }
    }

  }
  socket.on('moveRequest',(mr:MoveRequest)=>{
    
    let roomId = findPlayer(socket.id,rooms)
    if(roomId){
      const roomObj = rooms.get(roomId)

      let game = roomObj?.game
      if(!game || !roomObj){
        console.log("ERROR")
        return 
      }
      //player verification 
      const correctPlayer = roomObj.players[game.turns%2]
      if(correctPlayer.socketId !== socket.id){
        console.log("ERROR WRONG PLAYER")
        return
      }

      let pieceToMove = gameFunction.findPiece(mr.pieceX,mr.pieceY,game.currentBoardState)
      if(!pieceToMove){
        console.log('ERROR: piece not found')
        return 
      }
      //is it the piece's turn to move?
      const colorEnum = gameFunction.determinePlayer(game)
      
      if(colorEnum!== pieceToMove.color){
        console.log('ERROR: WRONG PIECE')
        return 
      }
      game.currentBoardState = pieceToMove.move(game.currentBoardState,mr.newX,mr.newY)
      const friendlyKing = game.currentBoardState.find((piece)=>piece.pieceTypeID===6 && piece.color===pieceToMove.color)
      const enemyKing = game.currentBoardState.find((piece)=>piece.pieceTypeID===6 && piece.color !== pieceToMove.color)
      
      if(!friendlyKing || !enemyKing){
        console.log("ERROR: KING MISSING")
        return
      }
      const friendlyCheck = gameFunction.checkInCheck(game.currentBoardState,friendlyKing)
      if (friendlyCheck!= false){
        console.log("ERROR: in check or cant find king")
        return 
      }
      //game resolution stage 
      game.turns += 1 
      if(gameFunction.checkIfMate(game.currentBoardState,enemyKing)){
        console.log("CHECKMATE")
        game.checkMate = enemyKing.color
      }
      let gf = exportToGF(game)
      for(let i = 0; i< roomObj.players.length; i++){
        const player = roomObj.players[i]
        const moveResponse:MoveResponse = {gameFormat: gf,playerColor:player.color} 
        io.to(player.socketId).emit('receiveGame',moveResponse)
      }
    }
  })


  
}
)

//helpers
export function findPlayer(playerId:string,rooms:Map<string,roomFormat>){
  for(let [roomId,roomObj] of rooms){
    
      for(let i =0; i<roomObj.players.length;i++){
        
        if(roomObj.players[i].socketId===playerId){
          return roomId;
        }
        
      }
  }
  return 'Error'

}
export interface roomFormat{
  roomId:string,
  players:playerFormat[],
  game:undefined|Game
  messages: string[]
}

export interface playerFormat{
  socketId:string,
  color: boolean
}