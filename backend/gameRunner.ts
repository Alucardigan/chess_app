
import BitBoard from "./bitboard"
import MoveGenerator from "./moveGenerator"

class GameRunner{
    //wanted a class that handles game moves that isnt the bitboard itself
    gameStates: BitBoard[]
    movegen:MoveGenerator
    constructor(){
        this.gameStates = [new BitBoard()]
        this.movegen = new MoveGenerator()
    }
    makeMove(from:number,to:number){
        
        const curBoard  = this.gameStates[this.gameStates.length-1]
        const fpiece = curBoard.determinePieceIdx(from)
        
        const {moves,captures} = this.movegen.generatePieceMove(from,fpiece,curBoard)
        let allMoves = moves | captures
        const newBoard = this.testMove(from,to,allMoves,curBoard)
        this.gameStates.push(newBoard)
        if(this.checkForCheck(fpiece < 6 ? 11: 5,newBoard)){
            console.log("CHECK")
            if(this.checkForMate(fpiece<6?11:5,newBoard)){
                console.log("CHECKMATE")
            }
            
        }
    }
    testMove(from:number,to:number,moves:bigint,curBoard:BitBoard){
        let resBoard = new BitBoard()
        resBoard.boardState = [...curBoard.boardState]//copy over the board
        const fromMask = 1n<< BigInt(from)
        let toMask = 1n << BigInt(to) & moves
        if(toMask===0n){
            return curBoard
        }
        const fpiece = curBoard.determinePieceIdx(from)
        const cpiece = curBoard.determinePieceIdx(to)
        
        resBoard.boardState[fpiece] &= ~fromMask//remove the piece from its from square
        
        if(cpiece!=-1){
            resBoard.boardState[cpiece] &= ~toMask //remove the captured bit
        }
        resBoard.boardState[fpiece] |= toMask
        return resBoard
    }
    checkForCheck(pieceIdx:number,bitboard:BitBoard):Boolean{
        const king = bitboard.boardState[pieceIdx < 6 ? 5:11]
        if(king===0n){return true}
        const kingSquare = Math.floor(Math.log2(Number(king)))
        
        let pawnCaptures = this.movegen.generatePawnMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((pawnCaptures.captures&bitboard.boardState[pieceIdx<6 ? 6 : 0]) != 0n){return true}
        let rookCaptures = this.movegen.getLegalRookMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((rookCaptures.captures & bitboard.boardState[pieceIdx<6 ? 7:1])!=0n){return true}
        let knightCaptures = this.movegen.generateKnightMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((knightCaptures.captures&bitboard.boardState[pieceIdx<6 ? 8: 2])!= 0n){return true}
        let bishopCaptures = this.movegen.getLegalBishopMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((bishopCaptures.captures&bitboard.boardState[pieceIdx<6 ? 9 : 3])!= 0n){return true}
        let queenCaptures = this.movegen.getLegalQueenMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((queenCaptures.captures & bitboard.boardState[pieceIdx<6 ? 10:4])!=0n){return true}
        return false

    }
    checkForMate(pieceIdx:number,bitboard:BitBoard):Boolean{
        const king = bitboard.boardState[pieceIdx < 6 ? 5:11]
        const kingSquare = Math.floor(Math.log2(Number(king)))
        let opposiingColorIdx = pieceIdx < 6 ? 0: 6 //get the opposing color's pawn index  
        //check if we are in check 
        if(this.checkForCheck(pieceIdx < 6 ? 5:11,bitboard) === false){
            console.log('we are indeed in check')
            return false
        }
        for(let i = opposiingColorIdx; i < opposiingColorIdx+6; i++){
            let pieces = bitboard.boardState[i]
            bitboard.printBoard(pieces)
            while(pieces != 0n){
                const square = Number(pieces & -pieces).toString(2).length - 1
                console.log(square,Number(pieces))
                const {moves,captures } = this.movegen.generatePieceMove(square,i,bitboard) 
                let allMoves = moves | captures
                while(allMoves != 0n){
                    const moveSquare = Number(allMoves & -allMoves).toString(2).length - 1
                    const newBoard = this.testMove(square,moveSquare,allMoves,bitboard)
                    console.log(square,moveSquare)
                    if(!(this.checkForCheck(pieceIdx < 6 ? 5:11,newBoard))){
                        console.log('no longer in check due to', square,moveSquare)
                        return false
                    }
                    allMoves &= allMoves -1n
                }
                pieces &= pieces -1n
            }
        }
        return true
    }
}
export default GameRunner