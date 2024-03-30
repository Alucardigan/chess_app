import express from 'express';
import { createServer } from 'node:http';
import {Server} from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url';

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

let rooms = new Map()

io.on('connection',(socket)=>{
  console.log('a user connected')
  socket.on('create-room',()=>{
      console.log('room created')
      const roomId = generateRoomId().toString()
      socket.emit('room-created',roomId)
  })

  //joining a room
  socket.on('join-room',(roomId)=>{
    socket.join(roomId);
    console.log('joined room')
  })
  //chat functions 
  socket.on('sendMessage',(message)=>{
    console.log('sending message')
    io.emit('receiveMessage',message)
  })
  //chess functions 
  socket.on('sendGame',(newGame)=>{
    console.log('sending game')
    io.emit('receiveGame',newGame)
  })

  
}
)


