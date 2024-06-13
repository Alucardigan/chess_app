import { createServer } from 'node:http';
import {Server, Socket} from 'socket.io'
import Game, { gameFunction } from './Game-classes/Game'
import {GameFormat,PieceFormat,MoveRequest,exportToGF}  from '../shared/gameRequests'
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
  console.log('a user connected')
  //creating a room
  socket.on('create-room',(isWhite)=>{
      
      const roomID = generateRoomId().toString()
      const newPlayer:playerFormat = {socketId:socket.id,color:isWhite} 
      const playerArray:playerFormat[] = [newPlayer]
      rooms.set(roomID, {roomId:roomID,players:playerArray,game:undefined,messages:[]})
      console.log('room created',roomID)
      socket.emit('room-created',roomID)
  })

  //joining a room
  socket.on('join-room',(roomId)=>{
    if(rooms.has(roomId)){
      let players = rooms.get(roomId)?.players
      if(players === undefined){return}
      console.log(players)
      let isWhite = true;
      if(!players.find((player)=> player.socketId === socket.id)){
        let isWhite = players[0].color ? false : true
        players.push({socketId:socket.id, color: isWhite})
      }
      else{
        isWhite = players.find((player)=> player.socketId === socket.id)?.color??isWhite
        console.log("Already in set ")
      }
      socket.join(roomId)
      socket.emit('send-color',isWhite)
      console.log('joined room',rooms)
    }
    else{
      console.log("room doesnt exist")
    }
    
  })
  //chat functions 
  socket.on('sendMessage',(message)=>{
    console.log(rooms,socket.id)
    let roomId = findPlayer(socket.id,rooms)
    if(roomId){
      console.log('sending message',rooms,socket.id)
      io.to(`${roomId}`).emit('receiveMessage',message)
    }
          
    
  })
  //chess functions 
  socket.on('startGame',()=>{
    console.log("Got the request for game to start",socket.id)
    let roomId = findPlayer(socket.id,rooms)
    console.log(roomId,socket.id,rooms)
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
      
      io.to(`${roomId}`).emit('receiveGame',exportToGF(newGame))
    }

  })
  socket.on('moveRequest',(mr:MoveRequest)=>{
    console.log(mr)
    let roomId = findPlayer(socket.id,rooms)
    if(roomId){
      let game = rooms.get(roomId)?.game
      if(!game){
        console.log("ERROR")
        return 
      }
      let pieceToMove = gameFunction.findPiece(mr.pieceX,mr.pieceY,game.currentBoardState)
      if(!pieceToMove){
        console.log('ERROR: piece not found')
        return 
      }
      //is it the piece's turn to move?
      const colorEnum = gameFunction.determinePlayer(game)
      console.log(colorEnum,pieceToMove.color)
      if(colorEnum!== pieceToMove.color){
        console.log('ERROR: WRONG PIECE')
        return 
      }
      game.currentBoardState = pieceToMove.move(game.currentBoardState,mr.newX,mr.newY)
      const friendlyKing = game.currentBoardState.find((piece)=>piece.pieceTypeID===6 && piece.color===pieceToMove.color)
      const enemyKing = game.currentBoardState.find((piece)=>piece.pieceTypeID===6 && piece.color !== pieceToMove.color)
      console.log(enemyKing,friendlyKing)
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
      console.log(gf)
      io.to(`${roomId}`).emit('receiveGame',exportToGF(game))
    }
  })


  
}
)

//helpers
export function findPlayer(playerId:string,rooms:Map<string,roomFormat>){
  for(let [roomId,roomObj] of rooms){
    
      for(let i =0; i<roomObj.players.length;i++){
        console.log(roomObj.players,i,roomObj.players[i])
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