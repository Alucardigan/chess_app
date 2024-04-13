import express from 'express';
import { createServer } from 'node:http';
import {Server} from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url';
import { room } from './room';


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const generateRoomId = ()=>{
    return Math.floor(Math.random()*1000000)
}
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(path.join(__dirname,'../build')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

let rooms = new Map<string,string[]>()

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
      players.push(socket.id)
      rooms.set(roomId,players)
      socket.join(roomId)
      console.log('joined room')
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