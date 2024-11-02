
import {Request,Response,NextFunction,Errback} from 'express';

async function createAIGame(req:Request,res:Response){
    console.log("Creating a new AI game",req.body)
    const uniqueID = new Date().getTime()
    res.status(200).json({'id':uniqueID})
}
export default createAIGame;