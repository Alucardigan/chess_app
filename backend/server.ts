// server.js
const express = require('express');
const cors = require('cors');
import {Request,Response,NextFunction,Errback} from 'express';
const gameCreator = require('./routes/gameCreationRoutes')
const app = express();



const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use((req:Request, res:Response, next:NextFunction) => {
  console.log(req.path, req.method,req.body);
  next()
});
app.use('/api/game/', gameCreator);


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});