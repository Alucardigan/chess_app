import GameRuleValidator from "./GameRuleValidator";
import activeMatches, { GameColor, GameStateException, GameType } from "./routeHandlers/helper";

interface GameEvent {
    bitString : string
    checkmate : boolean
    stalemate : boolean
    winner : string | undefined
}
export enum GameActionRequired{
    NO_ACTION,
    PROMOTION_REQUIRED
}

class GameStateManager{
    static async handleMove(gameID:number,userID:String , from:number,to:number){
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
        await game?.makeMove(from,to)
        //gamecolor is opposite bc it just changed
        if(GameRuleValidator.promotionAvailableCheck(game.getColorByTurn()===GameColor.WHITE?0:6,game.gameStates[game.gameStates.length-1])){
            console.log("Promotion required")
            game.turns -=1
            return GameActionRequired.PROMOTION_REQUIRED
        }
        if(game.gameType===GameType.AI){
            let AIMove = await game.AIPlayer.getMove(game,game.AIPlayer.color)
            await game.makeMove(AIMove.from,AIMove.to)
            if(GameRuleValidator.promotionAvailableCheck(game.getColorByTurn()===GameColor.WHITE?0:6,game.gameStates[game.gameStates.length-1])){
                console.log("AI promotion",game.getColorByTurn(),game.turns)
                game.turns -=1
                this.promotionUpdates(gameID,game.AIPlayer.promotionTarget)
                game.turns += 1
            }
        }
        console.log("event",game.gameStates[game.gameStates.length-1].convertToString(),game.gameStates.length)
        return GameActionRequired.NO_ACTION
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
    static promotionUpdates(gameID:number,promotionChoice:number){
        const game = activeMatches.get(Number(gameID))//unsure why type casting is required here but it is 
        if(!game){
            throw new GameStateException("404 Game", "HIGH", "Game can't be found")
        }
        let pieceIdx = game.getColorByTurn()===GameColor.BLACK ? 0:6
        let lastGameState = game.gameStates[game.gameStates.length-1] 
        game.gameStates.push(GameRuleValidator.promotionUpdate(pieceIdx,lastGameState,promotionChoice))
        game.turns+=2
        
    }


}

export default GameStateManager;