import bishopMagicGenerator from "./bishopMagicGen";
import BitBoard from "./bitboard";
import GameRunner from "./gameRunner";
import {BISHOP_MAGIC_NUMBERS} from "./magic"
import RookMagicGenerator from "./rookMagicGen";

interface Response {
    moves: bigint,
    captures: bigint 
}
interface generatorHashMap {
    [key:number] : (square: number, color: number,bitboard:BitBoard) => Response 
}
class MoveGenerator{
    generatorMap:generatorHashMap//TODO: Set a type 
    //color = 0 if black or 6 if white
    bishopMoveGen : bishopMagicGenerator
    rookMoveGen: RookMagicGenerator
    constructor(){
        
        this.generatorMap = {
            0 : this.generatePawnMoves.bind(this),
            1 : this.getLegalRookMoves.bind(this),
            2 : this.generateKnightMoves.bind(this),
            3 : this.getLegalBishopMoves.bind(this),
            4 : this.getLegalQueenMoves.bind(this),
            5 : this.generateKingMoves.bind(this),
            6 : this.generatePawnMoves.bind(this),
            7 : this.getLegalRookMoves.bind(this),
            8 : this.generateKnightMoves.bind(this),
            9 : this.getLegalBishopMoves.bind(this),
            10: this.getLegalQueenMoves.bind(this),
            11: this.generateKingMoves.bind(this)
        }
        this.bishopMoveGen = new bishopMagicGenerator() 
        this.rookMoveGen = new RookMagicGenerator()
    }
    generatePieceMove(square: number, pieceIdx: number,bitboard:BitBoard):Response{
        let response = this.generatorMap[pieceIdx](square,pieceIdx,bitboard)
        return response 
    }
    //pawn moves
    generatePawnMoves(square: number, pieceIdx: number,bitboard:BitBoard):Response{
        const RANK1 = 0b0000000011111111111111111111111111111111111111111111111111111111n
        const RANK8 = 0b1111111111111111111111111111111111111111111111111111111100000000n
        const A_FILE = 0b1111111011111110111111101111111011111110111111101111111011111110n 
        const H_FILE = 0b0111111101111111011111110111111101111111011111110111111101111111n
        let moves = 0n
        let pawns  = bitboard.boardState[pieceIdx]
        
        pawns = pawns & (1n<<BigInt(square))
        //single move
        let move = pieceIdx < 6 ? pawns<<8n : pawns >> 8n
        const pieceBlocks = bitboard.getAllPieces()
        const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
        move &=emptyspaces
        moves |=move
        //double move
        if((pieceIdx<6 && square>=8 &&square <=15)||(pieceIdx>=6 && square>=48 && square <=55)){
            let move = pieceIdx<6 ? pawns<<16n : pawns >> 16n
            const pieceBlocks = bitboard.getAllPieces()
            const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
            move &=emptyspaces
            moves |= move
        }
        //captures 
        let captures  = 0n
        const enemyPieces = pieceIdx < 6 ? bitboard.getWhitePieces() : bitboard.getBlackPieces()
        captures |= pieceIdx < 6 ? ((pawns&A_FILE&RANK1)<< 7n) : ((pawns&A_FILE&RANK8)>> 9n)// top left 
        captures |= pieceIdx < 6 ? ((pawns&H_FILE&RANK1)<< 9n) : ((pawns&H_FILE&RANK8)>> 7n)//top right
        captures &= enemyPieces
        return {moves,captures}
    }
    //bishop moves
    getLegalBishopMoves(square: number, pieceIdx: number,bitboard:BitBoard): Response {
        let allPieces = bitboard.getAllPieces()
        let friendlyPieces = pieceIdx < 6 ? bitboard.getBlackPieces() : bitboard.getWhitePieces()
        // Get the blockers for magic index calculation
        const blockers = allPieces & this.bishopMoveGen.getBishopMask(square);
        
        // Use magic indexing to get all possible moves
        const key = this.bishopMoveGen.getMagicIndex(blockers, this.bishopMoveGen.magicNumbers[square], this.bishopMoveGen.magicShifts[square]);
        const allPossibleMoves = this.bishopMoveGen.attackTable[square][key];
        
        // Captures are moves that intersect with enemy pieces
        // Enemy pieces = all pieces EXCEPT friendly pieces (XOR with friendly pieces)
        const captures = allPossibleMoves & (allPieces ^ friendlyPieces);
        
        // Quiet moves are moves that don't land on any pieces
        const moves = allPossibleMoves & ~allPieces;
        
        return { moves, captures };
    }
    //knight moves
    generateKnightMoves(square:number,pieceIdx:number,bitboard:BitBoard){
        let moves = 0n
        let captures = 0n
        //edges
        const RANK1 = 0b0000000011111111111111111111111111111111111111111111111111111111n
        const RANK2 = 0b1111111100000000111111111111111111111111111111111111111111111111n
        const RANK7 = 0b1111111111111111111111111111111111111111111111110000000011111111n
        const RANK8 = 0b1111111111111111111111111111111111111111111111111111111100000000n
        const A_FILE =0b1111111011111110111111101111111011111110111111101111111011111110n
        const B_FILE =0b1111110111111101111111011111110111111101111111011111110111111101n
        const G_FILE =0b1011111110111111101111111011111110111111101111111011111110111111n 
        const H_FILE =0b0111111101111111011111110111111101111111011111110111111101111111n
        
        const pieceBlocks = bitboard.getAllPieces()
        const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
        let knights = bitboard.boardState[pieceIdx]
        let knight = knights & (1n<<BigInt(square))//masking
        //move the piece and exclude ranks and files from which it shouldnt make the move
        moves |= ((knight&A_FILE&RANK7&RANK8) >> 17n) // top left 
        moves |= ((knight&H_FILE&RANK7&RANK8) >> 15n) // top right
        moves |= ((knight&A_FILE&B_FILE&RANK8) >> 10n) // small top left
        moves |= ((knight&G_FILE&H_FILE&RANK8) >> 6n) // small top right
        moves |= ((knight&A_FILE&RANK1&RANK2) << 15n) // bottom left
        moves |= ((knight&H_FILE&RANK1&RANK2) <<17n) // bottom right
        moves |= ((knight&A_FILE&B_FILE&RANK1) <<6n) // small bottom left
        moves |= ((knight&G_FILE&H_FILE&RANK1) <<10n)// small bottom right 
        
        const oppPieces = pieceIdx < 6 ? bitboard.getWhitePieces() :bitboard.getBlackPieces()
        captures = moves & oppPieces
        moves &= emptyspaces// only move to empty spaces
        return {moves,captures}
    }
    getLegalRookMoves(square: number, pieceIdx: number,bitboard:BitBoard): Response {
        let allPieces = bitboard.getAllPieces()
        let friendlyPieces = pieceIdx < 6 ? bitboard.getBlackPieces() : bitboard.getWhitePieces()
        // Get the blockers for magic index calculation
        const blockers = allPieces & this.rookMoveGen.getAltRookMask(square);
        // Use magic indexing to get all possible moves
        console.log(square,blockers,pieceIdx)
        const key = this.rookMoveGen.getMagicIndex(blockers, this.rookMoveGen.magicNumbers[square], this.rookMoveGen.magicShifts[square]);
        const allPossibleMoves = this.rookMoveGen.attackTable[square][key];
        // Enemy pieces = all pieces EXCEPT friendly pieces (XOR with friendly pieces)
        const captures = allPossibleMoves & (allPieces  & ~friendlyPieces);
        
        // Quiet moves are moves that don't land on any pieces
        const moves = allPossibleMoves & ~allPieces;
        return { moves, captures };
    }
    //queen moves 
    getLegalQueenMoves(square:number,pieceIdx:number,bitboard:BitBoard):Response{
        const bishop= this.getLegalBishopMoves(square,pieceIdx,bitboard)
        const rook = this.getLegalRookMoves(square,pieceIdx,bitboard)
        const moves = rook.moves| bishop.moves
        const captures = rook.captures | bishop.captures
        return {moves,captures} 
    }
    //king moves 
    generateKingMoves(square:number,pieceIdx:number,bitboard:BitBoard):Response{
        let moves = 0n
        let captures = 0n
        const RANK1 = 0b0000000011111111111111111111111111111111111111111111111111111111n
        const RANK8 = 0b1111111111111111111111111111111111111111111111111111111100000000n
        const A_FILE = 0b1111111011111110111111101111111011111110111111101111111011111110n 
        const H_FILE = 0b0111111101111111011111110111111101111111011111110111111101111111n
        const WHITE_KING_SIDE_CASTLE  = 0b0110000000000000000000000000000000000000000000000000000000000000n
        const WHITE_QUEEN_SIDE_CASTLE = 0b0000111000000000000000000000000000000000000000000000000000000000n
        const BLACK_KING_SIDE_CASTLE  = 0b0000000000000000000000000000000000000000000000000000000001100000n
        const BLACK_QUEEN_SIDE_CASTLE = 0b0000000000000000000000000000000000000000000000000000000000001110n
        const pieceBlocks = bitboard.getAllPieces()
        const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
        let king = bitboard.boardState[pieceIdx]

        moves |= ((king&RANK8) >> 8n)// top
        moves |= ((king&A_FILE&RANK8)>> 9n)// top left 
        moves |= ((king&H_FILE&RANK8)>> 7n)// top right
        moves |= ((king&RANK1) << 8n)//bottom
        moves |= ((king&A_FILE&RANK1)<< 7n)//bottom right
        moves |= ((king&H_FILE&RANK1)<< 9n)//bottom left
        moves |= ((king&A_FILE)>>1n)//left 
        moves |= ((king&H_FILE)<<1n)//right
        //king castling 
        let am = this.generateAttackMask(pieceIdx,bitboard)
        
        if((pieceIdx === 11)){
            if((bitboard.WHITE_KING_SIDE_CASTLE)&&((WHITE_KING_SIDE_CASTLE&pieceBlocks) ===0n)){
                let castlingMove = (king)|(king << 1n)|(king << 2n)
                if((am&castlingMove)===0n){
                    moves |= (king << 2n)
                }
            }
            if((bitboard.WHITE_QUEEN_SIDE_CASTLE)&&((WHITE_QUEEN_SIDE_CASTLE&pieceBlocks) ===0n)){
                let castlingMove = (king)|(king >> 1n)|(king >> 2n)|(king >> 3n)
                if((am&castlingMove)===0n){
                    moves |= (king >>2n)
                }
            
            }
        }
        if((pieceIdx === 5)){
            if((bitboard.BLACK_KING_SIDE_CASTLE)&&((BLACK_KING_SIDE_CASTLE&pieceBlocks) ===0n)){
                let castlingMove = (king)|(king << 1n)|(king << 2n)
                if((am&castlingMove)===0n){
                    moves |= (king << 2n)
                }
            }
            if((bitboard.BLACK_QUEEN_SIDE_CASTLE)&&((BLACK_QUEEN_SIDE_CASTLE&pieceBlocks) ===0n)){
                let castlingMove = (king)|(king >> 1n)|(king >> 2n)|(king >> 3n)
                if((am&castlingMove)===0n){
                    moves |= (king >>2n)
                }
            }    
            
        }
        

        const oppPieces = pieceIdx < 6 ? bitboard.getWhitePieces() :bitboard.getBlackPieces()
        captures = moves & oppPieces
        moves &= emptyspaces// only move to empty spaces

        return {moves,captures}
    }
    generateAttackMask(kingIdx:number,bitboard:BitBoard){
        let startingIdx =kingIdx < 6 ? 6 : 0 
        let attackMask = 0n
        for(let i = startingIdx; i < startingIdx +5 ; i ++ ){
            let pieces = bitboard.boardState[i]
            while(pieces != 0n){
                
                const square = Number(pieces & -pieces).toString(2).length - 1
                const {moves,captures } = this.generatePieceMove(square,i,bitboard) 
                
               
                attackMask |= moves | captures
                
                pieces &= pieces -1n
            }
            
            
        }
        return attackMask

    }
    isSquareAttacked(square:number, pieceIdx:number,bitboard:BitBoard){ 
        let pawnCaptures = this.generatePawnMoves(square,pieceIdx < 6 ? 5:11,bitboard)
        if((pawnCaptures.captures&bitboard.boardState[pieceIdx<6 ? 6 : 0]) != 0n){return true}
        let rookCaptures = this.getLegalRookMoves(square,pieceIdx < 6 ? 5:11,bitboard)
        if((rookCaptures.captures & bitboard.boardState[pieceIdx<6 ? 7:1])!=0n){return true}
        let knightCaptures = this.generateKnightMoves(square,pieceIdx < 6 ? 5:11,bitboard)
        if((knightCaptures.captures&bitboard.boardState[pieceIdx<6 ? 8: 2])!= 0n){return true}
        let bishopCaptures = this.getLegalBishopMoves(square,pieceIdx < 6 ? 5:11,bitboard)
        if((bishopCaptures.captures&bitboard.boardState[pieceIdx<6 ? 9 : 3])!= 0n){return true}
        let queenCaptures = this.getLegalQueenMoves(square,pieceIdx < 6 ? 5:11,bitboard)
        if((queenCaptures.captures & bitboard.boardState[pieceIdx<6 ? 10:4])!=0n){return true}
        return false
    }
    

    //debug methods
    printBit(bit:BigInt){
        console.log(bit.toString(2).padStart(64,'0'))
    }
    printBoard(bit:BigInt){
        let bitString = bit.toString(2).padStart(64,'0')
        for(let i = 0; i < bitString.length; i+= 8){
            console.log(bitString.slice(i,i+8))

        }
    }
}

export default MoveGenerator



