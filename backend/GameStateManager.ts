import activeMatches, { GameColor } from "./routeHandlers/helper";

interface GameEvent {
    bitString : String
    checkMate : boolean
    winner : GameColor | undefined

}
class GameStateManager{
    static handleMove(gameID:number,userID:String , from:number,to:number){
        const game = activeMatches.get(Number(gameID))//unsure why type casting is required here but it is 
        if(!game){
            console.log('cannot find bitboard')
            return ''
        }
        let userWhoseTurnItIs= game.getPlayerByTurn()
        if(!userWhoseTurnItIs){
            console.log("User cannot be found")
            let bitString =game.gameStates[game.gameStates.length-1].convertToString()
            return bitString?.split("").reverse().join("")
            
        }
        console.log(userWhoseTurnItIs,userID)
        if(userWhoseTurnItIs!==userID){
            console.log("Incorrect user: Blocked")
            let bitString =game.gameStates[game.gameStates.length-1].convertToString()
            return bitString?.split("").reverse().join("")
            
        }
        game?.makeMove(from,to)
    }

    static exportEventToSocket(gameID:number){
        
        const game = activeMatches.get(Number(gameID))//unsure why type casting is required here but it is 
        if(!game){
            console.log('cannot find bitboard',gameID)
            return ''
        }
        let bitString = game.gameStates[game.gameStates.length-1].convertToString()
        if(!bitString){
            console.log("INVALID GAME STATE STRING",bitString)
            return 
        }
        bitString = bitString.split("").reverse().join("")
        let gameEvent: GameEvent = {
            bitString : bitString,
            checkMate : game.checkMate === undefined ? false : true,
            winner : game.checkMate
        }
        return gameEvent
    }


}

export default GameStateManager;