
import {Request,Response} from 'express';
import activeMatches, { GameColor, GameType } from './helper';
import GameRunner from '../gameRunner';


async function createAIGame(req:Request,res:Response){
    console.log("Creating a new AI game",req.body)
    const uniqueID = new Date().getTime()
    const gameRunner = new GameRunner(GameType.AI)
    const userID = gameRunner.playerManager.addPlayer(req.body.username,GameColor.WHITE)
    gameRunner.playerManager.addPlayer("AI",GameColor.BLACK)
    activeMatches.set(uniqueID,gameRunner)
    res.status(200).json({'gameID':uniqueID,'userID':userID})
}
async function createPlayerGame(req:Request,res:Response){
    console.log("Creating a new player game",req.body)
    const uniqueID = new Date().getTime()
    const gameRunner = new GameRunner(GameType.PLAYER)
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
    activeMatches.set(Number(uniqueID),gameRunner)

    res.status(200).json({'gameID':uniqueID,'userID':userID})
}


export  {createAIGame,createPlayerGame,joinPlayerGame};