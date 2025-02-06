
import {Request,Response,NextFunction,Errback} from 'express';
import activeMatches from './helper';
import BitBoard from '../bitboard';
import GameRunner from '../gameRunner';

async function createAIGame(req:Request,res:Response){
    console.log("Creating a new AI game",req.body)
    const uniqueID = new Date().getTime()
    activeMatches.set(uniqueID,new GameRunner())
    res.status(200).json({'id':uniqueID})
}
export default createAIGame;