import { ROOK_MAGIC_NUMBERS } from "./magic"

class RookMagicGenerator{
    attackTable:bigint[][]
    magicShifts:number[]
    magicNumbers:bigint[]
    constructor(){
        this.attackTable = new Array(64)
        this.magicShifts = this.calculateMagicShifts()
        this.magicNumbers = ROOK_MAGIC_NUMBERS
        this.generateRookMoves()
    }
    generateRookMoves() {
        for(let i = 0; i < 64; i++) {
          const attack = this.getRookMask(i);
          const blockers = this.getRookBlockers(attack);
          this.attackTable[i] = new Array(1 << this.popCount(attack));
          
          for(let blocker of blockers) {
            const key = this.getMagicIndex(blocker, this.magicNumbers[i], this.magicShifts[i]);
            this.attackTable[i][key] = this.calculateRookAttacks(i, blocker);
          }
        }
      }
    getRookMask(fromTile:number){//get rook attack squares 
        let mask = 0n
        let square = 1n<<BigInt(fromTile)
        let rank = Math.floor(fromTile/8)
        let file = fromTile%8
        for(let i = 1;i<(8-file);i++ ){//left
            mask |= square<<BigInt(i)
        }
        for(let i = 1; i<=(file);i++){//right
            mask |= square>>BigInt(i)
        }
        for(let i = 1; i <(8-rank);i++){//up
            mask |= square<<BigInt(8*i)
        }
        for(let i = 1; i <=(rank);i++){//down
            mask |= square>>BigInt(8*i)
        }
        return mask
    }
    getRookBlockers(attack:bigint){
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
            const mask = this.getRookMask(square);
            
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
    calculateRookAttacks(square: number, blockers: bigint): bigint {
        let attacks = 0n;
        let rank = Math.floor(square/8);
        let file = square%8;
        
        for(let i = 1;i<(8-file);i++ ){//left
            const mask = 1n<<BigInt(square + i)
            attacks |= mask
            if((blockers&mask)!== 0n) break;
        }
        for(let i = 1; i<=(file);i++){//right
            const mask = 1n<<BigInt(square - i)
            attacks |= mask
            if((blockers&mask)!== 0n) break;
        }
        for(let i = 1; i <(8-rank);i++){//up
            
            const mask = 1n<<BigInt(square + 8*i)
            attacks |= mask
            if((blockers&mask)!== 0n) break;
        }
        for(let i = 1; i <=(rank);i++){//down
            const mask = 1n<<BigInt(square - 8*i)
            attacks |= mask
            if((blockers&mask)!== 0n) break;
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

export default RookMagicGenerator