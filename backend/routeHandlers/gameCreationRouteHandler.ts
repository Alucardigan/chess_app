
import {Request,Response,NextFunction,Errback} from 'express';
import activeMatches, { GameColor } from './helper';
import BitBoard from '../bitboard';
import GameRunner from '../gameRunner';


async function createAIGame(req:Request,res:Response){
    console.log("Creating a new AI game",req.body)
    const uniqueID = new Date().getTime()
    activeMatches.set(uniqueID,new GameRunner())
    res.status(200).json({'id':uniqueID})
}
async function createPlayerGame(req:Request,res:Response){
    console.log("Creating a new player game",req.body)
    const uniqueID = new Date().getTime()
    const gameRunner = new GameRunner()
    const userID = gameRunner.playerManager.addPlayer(req.body.username,GameColor.WHITE)
    activeMatches.set(uniqueID,gameRunner)
    res.status(200).json({'gameID':uniqueID,'userID':userID})
}

async function joinPlayerGame(req:Request,res:Response){
   
    const uniqueID = req.body.joinCode
    const gameRunner = activeMatches.get(Number(uniqueID))
    const userID = gameRunner?.playerManager.addPlayer(req.body.username,GameColor.BLACK)
    if(!gameRunner){
        console.log("CANNOT FIND GAME")
        return 
    }
    activeMatches.set(uniqueID,gameRunner)

    res.status(200).json({'gameID':uniqueID,'userID':userID})
    console.log("Joining a new player game",uniqueID)
}


export  {createAIGame,createPlayerGame,joinPlayerGame};