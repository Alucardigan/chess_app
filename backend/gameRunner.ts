import BitBoard from "./bitboard"
import MoveGenerator from "./moveGenerator"
import PlayerManager from "./playerManager"
import { CastleRookMove, ChatMessage, GameColor, GameStateException, GameType, PromotionTarget } from "./routeHandlers/helper"
import AIPLayer from "./AIPlayer"
import GameRuleValidator from "./GameRuleValidator"


class GameRunner{
    //wanted a class that handles game moves that isnt the bitboard itself
    gameStates: BitBoard[]
    movegen:MoveGenerator
    promotionTarget:PromotionTarget
    playerManager: PlayerManager
    turns: number
    checkMate : GameColor | undefined //undefined on intialisation, is used to record the WINNER's color
    gameType : GameType
    gameChat: ChatMessage[]
    AIPlayer: AIPLayer
    staleMate : boolean
    constructor(gameType : GameType){
        this.gameStates = [new BitBoard()]
        this.movegen = new MoveGenerator()
        this.promotionTarget = {
            white : 10,
            black : 4
        }
        this.playerManager = new PlayerManager()
        this.turns = 0
        this.checkMate = undefined
        this.gameType = gameType
        this.gameChat = []
        this.AIPlayer = new AIPLayer()
        this.staleMate = false
    }
    makeMove(from:number,to:number){
        
        const curBoard  = this.gameStates[this.gameStates.length-1]
        const fpiece = curBoard.determinePieceIdx(from)
        
        const {moves,captures} = this.movegen.generatePieceMove(from,fpiece,curBoard)
        let allMoves = moves | captures
        const newBoard = GameRuleValidator.testMove(from,to,allMoves,this.promotionTarget,curBoard)
        if(GameRuleValidator.checkForCheck(fpiece,newBoard,this.movegen)){
            throw new GameStateException("405 In Check","LOW", "Can't move piece while in check")
        }
        this.gameStates.push(newBoard)
        
        if(GameRuleValidator.checkForCheck(fpiece < 6 ? 11: 5,newBoard,this.movegen)){
            if(GameRuleValidator.checkForMate(fpiece<6?11:5,newBoard,this.promotionTarget,this.movegen)){
                console.log("CHECKMATE",(this.turns%2==0) ? GameColor.WHITE : GameColor.BLACK)
                this.checkMate = (this.turns%2==0) ? GameColor.WHITE : GameColor.BLACK
                this.turns +=1 
                return 
            }
        }
        if(GameRuleValidator.checkForStalemate(fpiece < 6 ? 11: 5,newBoard,this.promotionTarget,this.movegen)){
            console.log("STALEMATE DETECTED")
            this.staleMate = true; 
            this.turns +=1;
            return
        }
        this.turns +=1 
        if(this.gameType===GameType.AI){
            this.gameStates.push(this.AIPlayer.makeMove(this,fpiece < 6 ? GameColor.WHITE : GameColor.BLACK))
            this.turns += 1
        }
    }
    
    getPlayerByTurn(){
        
        return this.playerManager.getPlayerByColor(this.getColorByTurn())
    }
    getColorByTurn(){
        
        return this.turns%2===0 ? GameColor.WHITE : GameColor.BLACK
    }
    getPieceColorByPosition(position:number){
        return this.gameStates[this.gameStates.length-1].determinePieceIdx(position)<6? GameColor.BLACK : GameColor.WHITE 
    }
}
export default GameRunner