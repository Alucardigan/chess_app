// imports
const express = require('express');
const cors = require('cors');
import {Request,Response,NextFunction,Errback} from 'express';

import activeMatches, { ChatMessage, GameStateException } from './routeHandlers/helper';
import GameStateManager from './GameStateManager';
const gameCreator = require('./routes/gameCreationRoutes')
const { Server, Socket } = require("socket.io");

const {createServer} =require('http')
//intialisation
const app = express();
const httpServer = createServer(app);
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
const io = new Server(httpServer, { cors: {
  origin: '*',  // Match your CORS settings
  methods: ['GET', 'POST']
}});

//some middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use((req:Request, res:Response, next:NextFunction) => {
  console.log(req.path, req.method,req.body);
  next()
});
app.use('/api/game/', gameCreator);


// Start server

//sockets

io.on("connection", (socket:any) => {
  console.log('connected by',socket.id)
  //game events
  socket.on('joinGame',({gameID,userID}:{gameID:number,userID:String})=>{
    let updatedPlayerInfo = activeMatches.get(Number(gameID))?.playerManager.getPlayerByID(String(userID))
    if(!updatedPlayerInfo){
      console.log("Player not found")
      return
    }
    updatedPlayerInfo.socketId = socket.id
    activeMatches.get(gameID)?.playerManager.players.set(userID,updatedPlayerInfo)
    socket.join(gameID);
    console.log(`Player ${userID} joined room ${gameID}`)
    let gameEvent = GameStateManager.exportEventToSocket(gameID)
    io.to(gameID).emit('receiveGame',gameEvent)
  })
  socket.on('movePiece',({gameID,userID,from,to}:{gameID:number,userID: String,from:number,to:number})=>{
    try{
      GameStateManager.handleMove(gameID,userID,from,to)
    }catch(error){
      if(error instanceof GameStateException){
        console.log(error.priority,error.title,error.message)
        io.to(gameID).emit("receiveError",error.title,error.message)

      }
    }

    let gameEvent = GameStateManager.exportEventToSocket(gameID)
    io.to(gameID).emit('receiveGame',gameEvent)
  })
  //chat events 
  socket.on('sendChatMessage',({gameID,userID,message}:{gameID:number,userID:string, message:string})=>{
    let game= activeMatches.get(Number(gameID))
    let player= game?.playerManager.getPlayerByID(userID)
    if(!player){
      console.log("ERROR: Player doenst belong to this game/cant be found")
    }
    const messageObj:ChatMessage = {username : player?.userName ? player.userName : player?.color, chatMessage : message}
    game?.gameChat.push(messageObj)

    io.to(gameID).emit('receiveChatMessage',{chatMessages: game?.gameChat})
  })
});

//server intialisation
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


