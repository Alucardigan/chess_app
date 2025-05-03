import GameRuleValidator from "./GameRuleValidator"
import BitBoard from "./bitboard"
import GameRunner from "./gameRunner"
import MoveGenerator from "./moveGenerator"
import { GameColor, GameType, PromotionTarget } from "./routeHandlers/helper"

enum Difficulty {
    EASY,
    MEDIUM,
    HARD
}

class AIPLayer{
    difficulty : Difficulty
    pointAllocation : Map<number, number>
    moveGenerator: MoveGenerator 
    promotionTarget : PromotionTarget
    depth : number
    constructor(){
        this.difficulty = Difficulty.MEDIUM 
        this.pointAllocation = new Map()
        this.pointAllocation.set(0,-10)
        this.pointAllocation.set(1,-50)       
        this.pointAllocation.set(2,-30)
        this.pointAllocation.set(3,-30)
        this.pointAllocation.set(4,-90)
        this.pointAllocation.set(5,-900)
        this.pointAllocation.set(6,10)
        this.pointAllocation.set(7,50)
        this.pointAllocation.set(8,30)
        this.pointAllocation.set(9,30)
        this.pointAllocation.set(10,90)
        this.pointAllocation.set(11,900)
        this.moveGenerator  = new MoveGenerator()
        this.promotionTarget = {
            white : 10,
            black : 4
        }
        this.depth =2//depth of min max tree

    }
    makeMove(gameRunner:GameRunner,gameColor:GameColor){
        let alpha = -Infinity;
        let beta = Infinity
        if(this.difficulty===Difficulty.MEDIUM){
            let curBoard = gameRunner.gameStates[gameRunner.gameStates.length-1]
            let possibleMoves = this.generateMoves(curBoard,gameColor)
            if(!possibleMoves.length){
                console.log("ERROR: AI has no moves. Stalemate detected??")
                return curBoard
            }
            let bestMove = possibleMoves[0]
            let bestMoveEval = this.MiniMax(bestMove,this.getOppositeColor(gameColor),this.depth,alpha,beta)
            for(let i = 1 ; i < possibleMoves.length;i ++){
                let posMoveEval =this.MiniMax(possibleMoves[i],this.getOppositeColor(gameColor),this.depth,alpha,beta)
                if(gameColor===GameColor.WHITE &&bestMoveEval < posMoveEval){
                    bestMove = possibleMoves[i]
                    bestMoveEval = posMoveEval
                }
                else if(gameColor===GameColor.BLACK &&bestMoveEval > posMoveEval){
                    bestMove = possibleMoves[i]
                    bestMoveEval = posMoveEval
                }
            }
            return bestMove

        }
        let curBoard = gameRunner.gameStates[gameRunner.gameStates.length-1]
        let possibleMoves = this.generateMoves(curBoard,gameColor)
        return this.randomMoves(possibleMoves)
    }
    /*
    gameRunner: gameRunner 
    gameColor: color of the side AI is playing
    */
    generateMoves(gameState: BitBoard,gameColor: GameColor){
        let startingIdx = gameColor === GameColor.BLACK ? 0 : 6;
        let moves:BitBoard[] = []
        for(let i = startingIdx; i < startingIdx+6; i++){
            let fromSquares = this.getSquares(gameState.boardState[i])
            for(let j = 0; j< fromSquares.length;j++ ){
                let moveResponse= this.moveGenerator.generatePieceMove(fromSquares[j],i,gameState)
                let possibleMoves = moveResponse.moves | moveResponse.captures
                let toSquares = this.getSquares(possibleMoves)
                for(let k = 0; k < toSquares.length; k ++){
                    let newGameState = GameRuleValidator.testMove(fromSquares[j],toSquares[k],possibleMoves,this.promotionTarget,gameState)
                    if(!GameRuleValidator.checkForCheck(gameColor===GameColor.BLACK? 5 : 11,newGameState,this.moveGenerator)){
                        moves.push(newGameState)   
                    }
                }
                
            }
        }        
        return moves
    }
    evalFunction(bitBoard:BitBoard):number{

        let evaluation =  0 
        for(let i = 0; i < bitBoard.boardState.length; i++){
            let point = this.pointAllocation.get(i)
            if(!point){
                console.log("EVAL ERROR")
                return 0
            }
            let piece = this.popCount(bitBoard.boardState[i])
            evaluation += point *piece
        }
        return evaluation
    }
    MiniMax(gameBoard: BitBoard, gameColor: GameColor,depth: number,alpha:number,beta:number){
        
        if(depth===0){
            return this.evalFunction(gameBoard)
        }
        let evaluation = gameColor=== GameColor.WHITE? -Infinity : Infinity;
        let possibleMoves = this.generateMoves(gameBoard,gameColor)
        for(let i = 0; i < possibleMoves.length; i ++){
            if(gameColor===GameColor.WHITE){
                evaluation = Math.max(evaluation,this.MiniMax(possibleMoves[i],GameColor.BLACK,depth -1,alpha,beta))
                alpha = Math.max(alpha,evaluation)
                if(alpha >= beta){
                    break;
                }
            }
            else{
                evaluation = Math.min(evaluation,this.MiniMax(possibleMoves[i],GameColor.WHITE,depth -1,alpha,beta))
                beta = Math.min(beta,evaluation)
                if(beta <= alpha){
                    break;
                }

            }
        }
        return evaluation
    }
    randomMoves(moves:BitBoard[]){
        const randomIdx = Math.floor(Math.random()*moves.length)
        return moves[randomIdx]
    }
    popCount(bitNumber:bigint){
        let count = 0 
        while(bitNumber!=0n){
            count += Number(bitNumber&1n)
            bitNumber >>= 1n
        }
        return count 
    }
    getSquares(bit:bigint){
        let idx = 0
        let squares = [] 
        while(bit!= 0n){
            if(bit&1n){
                squares.push(idx)
            }
            bit >>=1n
            idx +=1  
        }
        return squares
    }
    getOppositeColor(gameColor:GameColor){
        return gameColor===GameColor.WHITE ? GameColor.BLACK:GameColor.WHITE
    }
}
export default AIPLayer