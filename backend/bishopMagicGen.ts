import { BISHOP_MAGIC_NUMBERS } from "./magic"

class bishopMagicGenerator{
    attackTable:bigint[][]
    magicShifts:number[]
    magicNumbers:bigint[]
    constructor(){
        this.attackTable = new Array(64)
        this.magicShifts = this.calculateMagicShifts()
        this.magicNumbers = BISHOP_MAGIC_NUMBERS
        this.generateBishopMoves()
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
}
export default bishopMagicGenerator