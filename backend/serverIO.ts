import express from 'express';
import { createServer } from 'node:http';
import {Server} from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url';
import { room } from './room';



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

let rooms = new Map<string,string[]>()

const generateRoomId = ()=>{
  return Math.floor(Math.random()*1000000)
}

io.on('connection',(socket)=>{
  console.log('a user connected')
  //creating a room
  socket.on('create-room',()=>{
      
      const roomId = generateRoomId().toString()
      rooms.set(roomId, [socket.id])
      console.log('room created',roomId)
      socket.emit('room-created',roomId)
  })

  //joining a room
  socket.on('join-room',(roomId)=>{
    if(rooms.has(roomId)){
      let players = rooms.get(roomId)
      if(players === undefined){return}
      if(!players.find((id)=> {id == socket.id})){
        players.push(socket.id)
      }
      else{
        console.log("Already in set ")
      }
      rooms.set(roomId,players)
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
  socket.on('sendGame',(newGame)=>{
    let roomId = findPlayer(socket.id,rooms)
    if(roomId){
      console.log('sending game')
      io.to(`${roomId}`).emit('receiveGame',newGame)
    }
    
  })

  
}
)

//helpers
export function findPlayer(playerId:string,rooms:Map<string,string[]>){
  for(let [roomId,playersIds] of rooms){
      for(let i =0; i<=playersIds.length;i++){
        if(playersIds[i]===playerId){
          return roomId;
        }
      }
  }

}