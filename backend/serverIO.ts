import { createServer } from 'node:http';
import {Server} from 'socket.io'
import Game, { gameFunction } from './Game-classes/Game'
import {GameFormat,PieceFormat,MoveRequest,exportToGF}  from '../shared/gameRequests'





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

io.on('connection',(socket)=>{
  console.log('a user connected')
  //creating a room
  socket.on('create-room',()=>{
      
      const roomID = generateRoomId().toString()
      rooms.set(roomID, {roomId:roomID,players:[socket.id],game:undefined})
      console.log('room created',roomID)
      socket.emit('room-created',roomID)
  })

  //joining a room
  socket.on('join-room',(roomId)=>{
    if(rooms.has(roomId)){
      let players = rooms.get(roomId)?.players
      if(players === undefined){return}
      if(!players.find((id)=> {id == socket.id})){
        players.push(socket.id)
      }
      else{
        console.log("Already in set ")
      }
      socket.join(roomId)
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
    console.log("Got the request for game to start")
    let roomId = findPlayer(socket.id,rooms)
    console.log(roomId,socket.id,rooms)
    let newGame = new Game();
    newGame.intialiseBoardState()
    if(roomId){
      let roomObj = rooms.get(roomId)
      if(roomObj){
        roomObj.game = newGame
      }
      let gf = exportToGF(newGame)
      console.log(gf)
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
      for(let i =0; i<=roomObj.players.length;i++){
        if(roomObj.players[i]===playerId){
          return roomId;
        }
      }
  }
  return 'Error'

}
export interface roomFormat{
  roomId:string,
  players:string[],
  game:undefined|Game
}
