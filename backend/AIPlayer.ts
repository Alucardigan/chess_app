import BitBoard from "./bitboard"
import GameRunner from "./gameRunner"
import MoveGenerator from "./moveGenerator"
import { GameColor, GameType } from "./routeHandlers/helper"

enum Difficulty {
    EASY,
    MEDIUM,
    HARD
}

class AIPLayer{
    difficulty : Difficulty
    pointAllocation : Map<number, number>
    moveGenerator: MoveGenerator 
    constructor(){
        this.difficulty = Difficulty.EASY 
        this.pointAllocation = new Map()
        this.pointAllocation.set(0,10)
        this.pointAllocation.set(1,50)       
        this.pointAllocation.set(2,30)
        this.pointAllocation.set(3,30)
        this.pointAllocation.set(4,90)
        this.pointAllocation.set(5,900)
        this.pointAllocation.set(6,-10)
        this.pointAllocation.set(7,-50)
        this.pointAllocation.set(8,-30)
        this.pointAllocation.set(9,-30)
        this.pointAllocation.set(10,-90)
        this.pointAllocation.set(11,-900)
        this.moveGenerator  = new MoveGenerator()

    }
    /*
    gameRunner: gameRunner 
    gameColor: color of the side AI is playing
    */
    generateMove(gameRunner: GameRunner,gameColor: GameColor){
        let gameState = gameRunner.gameStates[gameRunner.gameStates.length-1]
        console.log(gameState,gameRunner.gameStates)
        let startingIdx = gameColor === GameColor.BLACK ? 0 : 6;
        let moves:any = []
        for(let i = startingIdx; i < startingIdx+6; i++){
            let fromSquares = this.getSquares(gameState.boardState[i])
            for(let j = 0; j< fromSquares.length;j++ ){
                let moveResponse= this.moveGenerator.generatePieceMove(fromSquares[j],i,gameState)
                let possibleMoves = moveResponse.moves | moveResponse.captures
                let toSquares = this.getSquares(possibleMoves)
                for(let k = 0; k < toSquares.length; k ++){
                    let newGameState = gameRunner.testMove(fromSquares[j],toSquares[k],possibleMoves,gameState)
                    if(!gameRunner.checkForCheck(gameColor===GameColor.BLACK? 5 : 11,newGameState)){
                        moves.push(newGameState)   
                    }
                }
                
            }
        }

        
        return this.randomMoves(moves)
    }
    evalFunction(bitBoard:BitBoard){

        let evaluation =  0 
        for(let i = 0; i < bitBoard.boardState.length; i++){
            let point = this.pointAllocation.get(i)
            if(!point){
                console.log("EVAL ERROR")
                return
            }
            let piece = this.popCount(bitBoard.boardState[i])
            evaluation += point *piece
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
}
export default AIPLayer