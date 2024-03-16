import express from 'express';
import { createServer } from 'node:http';
import {Server} from 'socket.io'
import path from 'path'
import { generateRoomId } from './backendHelpers';

const app = express();
const server = createServer(app);
const io = new Server(server)

io.on('connection',(socket)=>{
    console.log('connected')
    //create room functionality 
    socket.on('create-room',()=>{
        console.log('room created')
        const roomId = generateRoomId().toString()
        socket.join(roomId)
        socket.emit('room-created',roomId)
    })
}
)
app.use(express.static(path.join(__dirname,'../build')))
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});