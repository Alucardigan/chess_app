import BitBoard from "./bitboard";
import {BISHOP_MAGIC_NUMBERS} from "./magic"

interface Response {
    moves: bigint,
    captures: bigint 
}
interface generatorHashMap {
    [key:number] : (square: number, color: number,bitboard:BitBoard) => Response 
}
class MoveGenerator{
    attackTable:bigint[][]
    magicShifts:number[]
    magicNumbers:bigint[]
    generatorMap:generatorHashMap//TODO: Set a type 
    //color = 0 if black or 6 if white
    constructor(){
        this.attackTable = new Array(64)
        this.magicShifts = this.calculateMagicShifts()
        this.magicNumbers = BISHOP_MAGIC_NUMBERS
        this.generatorMap = {
            0 : this.generatePawnMoves,
            3 : this.getLegalBishopMoves
        }
    }
    generatePieceMove(square: number, pieceIdx: number,bitboard:BitBoard):Response{
        let color = pieceIdx < 6 ? 1 : 0 
        if(pieceIdx > 5){
            pieceIdx -=6
        }
        let response = this.generatorMap[pieceIdx](square,color,bitboard)
        console.log('color',color,response)
        return response 
    }
    generatePawnMoves(square: number, color: number,bitboard:BitBoard):Response{
        
        let moves = 0n
        let pawns  = bitboard.boardState[color ]
        pawns = pawns & (1n<<BigInt(square))
        //single move
        let move = color == 0 ? pawns<<8n : pawns >> 8n
        const pieceBlocks = bitboard.getAllPieces()
        const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
        move &=emptyspaces
        moves |=move
        console.log('pawn Generator',square,color,move,pawns,emptyspaces,pieceBlocks)
        //double move
        if((color==0 && square>=8 &&square <=15)||(color==6 && square>=48 && square <=55)){
            let move = color == 0 ? pawns<<16n : pawns >> 16n
            const pieceBlocks = bitboard.getAllPieces()
            const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
            move &=emptyspaces
            moves |= move
        }
        //captures 
        let captures  = 0n
        if(color==0){
            const whitePieces = bitboard.getWhitePieces()
            let move = square%8==0 ? pawns : (pawns << 7n) & whitePieces
            captures |=move
            move = (square+1)%8 == 0 ? pawns : (pawns << 9n) & whitePieces
            captures |= move
        }
        else{
            const blackPieces = bitboard.getBlackPieces()
            let move = square%8==0 ? pawns : (pawns >>9n) & blackPieces
            captures |=move
            move = (square+1)%8 == 0 ? pawns : (pawns >> 7n) & blackPieces
            captures |= move
        }
        return {moves,captures}
    }
    generateBishopMoves() {
        for(let i = 0; i < 64; i++) {
          const attack = this.getBishopMask(i);
          const blockers = this.getBishopBlockers(attack);
          this.attackTable[i] = new Array(1 << this.popCount(attack));
          
          for(let blocker of blockers) {
            const key = this.getMagicIndex(blocker, this.magicNumbers[i], this.magicShifts[i]);
            this.attackTable[i][key] = this.calculateBishopAttacks(i, blocker);
          }
        }
      }
    getBishopMask(fromTile:number){//function to generate bishop attack squares from a tile 
        let mask = 0n 
        let tile = 1n<<BigInt(fromTile)
        let rank = Math.floor(fromTile/8)
        let file = fromTile%8
        //top right 
        
        for(let i=1;i<=Math.min(rank,7-file);i++){
            mask |= tile>>BigInt(7*i)
        }
        //top left
        for(let i=1;i<=Math.min(rank,file);i++){
            mask |= tile>>BigInt(9*i)
        }
        //bot right
        for(let i=1;i<=Math.min(7-rank,7-file);i++){
            mask |= tile<<BigInt(9*i)
        }
        //bot left
        for(let i=1;i<=Math.min(7-rank,file);i++){
            mask |= tile<<BigInt(7*i)
        }
        
        return mask

    }
    getBishopBlockers(attack:bigint){
        let blockers = []
        let bitIndexes = []
        for(let i =0; i < 64;i++){
            if((attack & 1n<<BigInt(i)) != 0n){
                bitIndexes.push(i)
            }
        }
        const totalPatterns = Math.pow(2,bitIndexes.length)
        for(let i = 0; i < totalPatterns; i ++ ){// i here is acting as the thing that decides which combinations of indexes to use i.e if i = 2, which in binary is 10, then use array[1],etc
            let pat = 0n
            for(let j = 0; j<bitIndexes.length;j++){
                if((i & (1<<j))!= 0){
                    pat |= 1n << BigInt(bitIndexes[j])
                }
            }
            blockers.push(pat)
        }
        return blockers
    }
    calculateMagicShifts(): number[] {
        const magicShifts = new Array(64);
        
        for(let square = 0; square < 64; square++) {
            // Calculate bishop attack mask for this square
            const mask = this.getBishopMask(square);
            
            // Count bits in the mask
            let relevantBits = 0;
            let tempMask = mask;
            while(tempMask !== 0n) {
                relevantBits++;
                tempMask &= tempMask - 1n;
            }
            
            // Magic index needs to map to a table of size 2^relevantBits
            // So we shift by (64 - relevantBits)
            magicShifts[square] = 64 - relevantBits;
        }
        
        return magicShifts;
    }
    calculateBishopAttacks(square: number, blockers: bigint): bigint {
        let attacks = 0n;
        let rank = Math.floor(square/8);
        let file = square%8;
        
        // Calculate attacks in all four diagonal directions
        // Northeast
        for(let r = rank + 1, f = file + 1; r < 8 && f < 8; r++, f++) {
          const squareMask = 1n << BigInt(r * 8 + f);
          attacks |= squareMask;
          if((blockers & squareMask) !== 0n) break;
        }
        
        // Northwest
        for(let r = rank + 1, f = file - 1; r < 8 && f >= 0; r++, f--) {
          const squareMask = 1n << BigInt(r * 8 + f);
          attacks |= squareMask;
          if((blockers & squareMask) !== 0n) break;
        }
        
        // Southeast
        for(let r = rank - 1, f = file + 1; r >= 0 && f < 8; r--, f++) {
          const squareMask = 1n << BigInt(r * 8 + f);
          attacks |= squareMask;
          if((blockers & squareMask) !== 0n) break;
        }
        
        // Southwest
        for(let r = rank - 1, f = file - 1; r >= 0 && f >= 0; r--, f--) {
          const squareMask = 1n << BigInt(r * 8 + f);
          attacks |= squareMask;
          if((blockers & squareMask) !== 0n) break;
        }
        
        return attacks;
      }
    // AI function: gets the number of bits in a bigint number. Used for calculating the size of each array inside the attacker table
    popCount(x: bigint): number {
        let count = 0;
        while(x !== 0n) {
          count++;
          x &= x - 1n;
        }
        return count;
      }
    getMagicIndex(blockers: bigint, magic: bigint, shift: number): number {
    return Number((blockers * magic) >> BigInt(shift));
    }
    getLegalBishopMoves(square: number, color: number,bitboard:BitBoard): Response {
        let allPieces = bitboard.getAllPieces()
        let friendlyPieces = bitboard.getBlackPieces()
        if(color==0){
            friendlyPieces = bitboard.getWhitePieces()
        }
        // Get the blockers for magic index calculation
        const blockers = allPieces & this.getBishopMask(square);
        
        // Use magic indexing to get all possible moves
        const key = this.getMagicIndex(blockers, this.magicNumbers[square], this.magicShifts[square]);
        const allPossibleMoves = this.attackTable[square][key];
        
        // Captures are moves that intersect with enemy pieces
        // Enemy pieces = all pieces EXCEPT friendly pieces (XOR with friendly pieces)
        const captures = allPossibleMoves & (allPieces ^ friendlyPieces);
        
        // Quiet moves are moves that don't land on any pieces
        const moves = allPossibleMoves & ~allPieces;
        
        return { moves, captures };
    }
    //debug methods
    printBit(bit:BigInt){
        return bit.toString(2).padStart(64,'0')
    }
    printBoard(bit:BigInt){
        let bitString = bit.toString(2).padStart(64,'0')
        for(let i = 0; i < bitString.length; i+= 8){
            console.log(bitString.slice(i,i+8))

        }
    }
}

export default MoveGenerator
