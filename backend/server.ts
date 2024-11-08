// imports
const express = require('express');
const cors = require('cors');
import {Request,Response,NextFunction,Errback} from 'express';
import { Socket } from 'socket.io-client';
const gameCreator = require('./routes/gameCreationRoutes')
const { Server } = require("socket.io");
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

io.on("connection", (socket:Socket) => {
  console.log('connected by',socket.id)
  socket.on('movePiece',({from,to}:{from:number,to:number})=>{
    console.log(from,to)
  })
});
//server intialisation
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});