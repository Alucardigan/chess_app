import BitBoard from "./bitboard"
import MoveGenerator from "./moveGenerator"
import {CastleRookMove, PromotionTarget} from "./routeHandlers/helper"

export default class GameRuleValidator{    
    static checkForCheck(pieceIdx:number,bitboard:BitBoard,movegen:MoveGenerator):Boolean{
        const king = bitboard.boardState[pieceIdx < 6 ? 5:11]
        if(king===0n){return true}
        const kingSquare = Math.floor(Math.log2(Number(king)))
        
        let pawnCaptures = movegen.generatePawnMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((pawnCaptures.captures&bitboard.boardState[pieceIdx<6 ? 6 : 0]) != 0n){return true}
        let rookCaptures = movegen.getLegalRookMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((rookCaptures.captures & bitboard.boardState[pieceIdx<6 ? 7:1])!=0n){return true}
        let knightCaptures = movegen.generateKnightMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((knightCaptures.captures&bitboard.boardState[pieceIdx<6 ? 8: 2])!= 0n){return true}
        let bishopCaptures = movegen.getLegalBishopMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((bishopCaptures.captures&bitboard.boardState[pieceIdx<6 ? 9 : 3])!= 0n){return true}
        let queenCaptures = movegen.getLegalQueenMoves(kingSquare,pieceIdx < 6 ? 5:11,bitboard)
        if((queenCaptures.captures & bitboard.boardState[pieceIdx<6 ? 10:4])!=0n){return true}
        return false

    }

    static checkForMate(pieceIdx:number,bitboard:BitBoard,promotionTarget:PromotionTarget,movegen:MoveGenerator):Boolean{
        let opposiingColorIdx = pieceIdx < 6 ? 0: 6 //get the opposing color's pawn index  
        //check if we are in check 
        if(GameRuleValidator.checkForCheck(pieceIdx < 6 ? 5:11,bitboard,movegen) === false){
            return false
        }
        for(let i = opposiingColorIdx; i < opposiingColorIdx+6; i++){
            let pieces = bitboard.boardState[i]
            while(pieces != 0n){
                const square = Number(pieces & -pieces).toString(2).length - 1

                const {moves,captures } = movegen.generatePieceMove(square,i,bitboard) 
                let allMoves = moves | captures
                while(allMoves != 0n){
                    const moveSquare = Number(allMoves & -allMoves).toString(2).length - 1
                    const newBoard = GameRuleValidator.testMove(square,moveSquare,allMoves,promotionTarget,bitboard)
                    if(!(GameRuleValidator.checkForCheck(pieceIdx < 6 ? 5:11,newBoard,movegen))){
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
    static checkForStalemate(pieceIdx:number,bitboard:BitBoard,promotionTarget:PromotionTarget,movegen:MoveGenerator){
        const king = bitboard.boardState[pieceIdx < 6 ? 5:11]
        let opposiingColorIdx = pieceIdx < 6 ? 0: 6 //get the opposing color's pawn index  
        //check if we are in check 
        if(GameRuleValidator.checkForCheck(pieceIdx < 6 ? 5:11,bitboard,movegen) === false){
            for(let i = opposiingColorIdx; i < opposiingColorIdx+6; i++){
                let pieces = bitboard.boardState[i]
                while(pieces != 0n){
                    const square = Number(pieces & -pieces).toString(2).length - 1
    
                    const {moves,captures } = movegen.generatePieceMove(square,i,bitboard) 
                    let allMoves = moves | captures
                    while(allMoves != 0n){
                        const moveSquare = Number(allMoves & -allMoves).toString(2).length - 1
                        const newBoard = this.testMove(square,moveSquare,allMoves,promotionTarget,bitboard)
                        if(!(GameRuleValidator.checkForCheck(pieceIdx < 6 ? 5:11,newBoard,movegen))){
                            return false
                        }
                        allMoves &= allMoves -1n
                    }
                    pieces &= pieces -1n
                }
            }
            return true
        }
        return false;
    }
    static testMove(from:number,to:number,moves:bigint,promotionTarget:PromotionTarget,curBoard:BitBoard){
        let resBoard = new BitBoard()
        resBoard.boardState = [...curBoard.boardState]//copy over the board
        const fromMask = 1n<< BigInt(from)
        let toMask = 1n << BigInt(to) & moves
        if(toMask===0n){
            console.log("NON MOVE")
            return curBoard
        }
        const fpiece = curBoard.determinePieceIdx(from)
        const cpiece = curBoard.determinePieceIdx(to)
        
        resBoard.boardState[fpiece] &= ~fromMask//remove the piece from its from square
        
        if(cpiece!=-1){
            resBoard.boardState[cpiece] &= ~toMask //remove the captured bit
        }
        resBoard.boardState[fpiece] |= toMask
        resBoard = this.promotionUpdate(fpiece,resBoard,promotionTarget)
        resBoard = this.castlingUpdate(from,to,fpiece,curBoard,resBoard)
        return resBoard
    }

    static castlingUpdate(from:number,to:number,pieceIdx:number,prevBoard:BitBoard,newBoard:BitBoard){
        let castles: Record<number,CastleRookMove> = {
            6062:{
                flag : newBoard.WHITE_KING_SIDE_CASTLE,
                nflag : newBoard.WHITE_QUEEN_SIDE_CASTLE,
                rFromMask:  0b1000000000000000000000000000000000000000000000000000000000000000n,
                rToMask :   0b0010000000000000000000000000000000000000000000000000000000000000n,
                kFromMask : 0b0001000000000000000000000000000000000000000000000000000000000000n,
                kToMask :   0b0100000000000000000000000000000000000000000000000000000000000000n,
                rPieceIdx : 7,
                kPieceIdx : 11
                
            },
            6058:{
                flag : newBoard.WHITE_QUEEN_SIDE_CASTLE,
                nflag : newBoard.WHITE_KING_SIDE_CASTLE,
                rFromMask:  0b0000000100000000000000000000000000000000000000000000000000000000n,
                rToMask :   0b0000100000000000000000000000000000000000000000000000000000000000n,
                kFromMask : 0b0001000000000000000000000000000000000000000000000000000000000000n,
                kToMask :   0b0000010000000000000000000000000000000000000000000000000000000000n,
                rPieceIdx : 7,
                kPieceIdx : 11
            },
            406:{
                flag : newBoard.BLACK_KING_SIDE_CASTLE,
                nflag : newBoard.WHITE_QUEEN_SIDE_CASTLE,
                rFromMask:  0b0000000000000000000000000000000000000000000000000000000010000000n,
                rToMask :   0b0000000000000000000000000000000000000000000000000000000000100000n,
                kFromMask : 0b0000000000000000000000000000000000000000000000000000000000010000n,
                kToMask :   0b0000000000000000000000000000000000000000000000000000000001000000n,
                rPieceIdx : 1,
                kPieceIdx : 5
            },
            402:{
                flag : newBoard.BLACK_QUEEN_SIDE_CASTLE,
                nflag : newBoard.WHITE_QUEEN_SIDE_CASTLE,
                rFromMask:  0b0000000000000000000000000000000000000000000000000000000000000001n,
                rToMask :   0b0000000000000000000000000000000000000000000000000000000000001000n,
                kFromMask : 0b0000000000000000000000000000000000000000000000000000000000010000n,
                kToMask :   0b0000000000000000000000000000000000000000000000000000000000000100n,
                
                rPieceIdx : 1,
                kPieceIdx : 5
            }
        }
        let key = from * 100 + to
        let castlingMove = castles[key]
        if(castlingMove === undefined){
            return newBoard
        }
        if(castlingMove.kFromMask ===  prevBoard.boardState[pieceIdx] && castlingMove.kToMask === newBoard.boardState[pieceIdx]){

            newBoard.boardState[castlingMove.rPieceIdx] &= ~castlingMove.rFromMask
            newBoard.boardState[castlingMove.rPieceIdx] |= castlingMove.rToMask 
        }
        return newBoard

    }
    static promotionUpdate(pieceIdx:number,newBoard:BitBoard,promotionTarget:PromotionTarget){
        if(pieceIdx<6){
            const PAWN_IDX = 0 
            const targetRow = 0b1111111100000000000000000000000000000000000000000000000000000000n
            let pawns = newBoard.boardState[PAWN_IDX];
            pawns &= targetRow
            if(pawns===0n){
                //no pawns to promote
                return newBoard
            }
            newBoard.boardState[PAWN_IDX] &= ~pawns
            newBoard.boardState[promotionTarget.black] |= pawns
            return newBoard
        }
        else{
            const PAWN_IDX = 6 
            const targetRow = 0b0000000000000000000000000000000000000000000000000000000011111111n
            let pawns = newBoard.boardState[PAWN_IDX];
            pawns &= targetRow
            if(pawns===0n){
                //no pawns to promote
                return newBoard
            }
            newBoard.boardState[PAWN_IDX] &= ~pawns
            newBoard.boardState[promotionTarget.white] |= pawns
            return newBoard
        }
        
        

    }
}