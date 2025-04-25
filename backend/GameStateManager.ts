import activeMatches, { GameColor, GameStateException } from "./routeHandlers/helper";

interface GameEvent {
    bitString : string
    checkmate : boolean
    stalemate : boolean
    winner : string | undefined

}

class GameStateManager{
    static handleMove(gameID:number,userID:String , from:number,to:number){
        const game = activeMatches.get(Number(gameID))//unsure why type casting is required here but it is 
        if(!game){
            throw new GameStateException("404 Game", "HIGH", "Game can't be found")
        }
        let userWhoseTurnItIs= game.getPlayerByTurn()
        if(!userWhoseTurnItIs){

            throw new GameStateException("404 User", "HIGH", "User can't be found")
        }
        if(userWhoseTurnItIs!==userID){
            throw new GameStateException("400 Incorrect User", "LOW", "It's not your turn")
        }
        if(game.getColorByTurn()!==game.getPieceColorByPosition(from)){

            throw new GameStateException("400 Wrong Piece", "LOW", "Thats not your piece")
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
            return ''
        }
        bitString = bitString.split("").reverse().join("")
        let gameEvent: GameEvent = {
            bitString : bitString,
            checkmate : game.checkMate === undefined ? false : true,
            winner : game.checkMate === undefined ? undefined : game.checkMate === GameColor.WHITE ? "White" : "Black",
            stalemate : game.staleMate
        }
        return gameEvent
    }


}

export default GameStateManager;