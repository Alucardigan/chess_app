import { ROOK_MAGIC_NUMBERS } from "./magic"

class RookMagicGenerator {
    attackTable: bigint[][]
    magicShifts: number[]
    magicNumbers: bigint[]
    constructor() {
        this.attackTable = new Array(64)
        this.magicShifts = this.calculateMagicShifts()
        this.magicNumbers = ROOK_MAGIC_NUMBERS
        this.generateRookMoves()
    }
    generateMagicNumbers(){
        this.magicNumbers = new Array(64)
        for(let i = 0; i < 64; i++){
            const attack = this.getRookMask(i)
            const blockers = this.getRookBlockers(attack)
            let attempts = 0 
            let genMgNum = BigInt(Math.floor(Math.random()*2**64))
            let map = new Map()

            for(let bl = 0; bl < blockers.length; bl++ ){
                let key = this.getMagicIndex(blockers[bl],genMgNum,this.magicShifts[i])
                if(map.get(key) != 1){
                    map.set(key,1)
                }
                else{
                    bl = 0
                    genMgNum =BigInt(Math.floor(Math.random()*2**64))
                    map = new Map()
                }
            }
            this.magicNumbers[i] = genMgNum
        }
    }
    generateRookMoves() {
        for (let i = 0; i < 64; i++) {
            const attack = this.getRookMask(i);
            const blockers = this.getRookBlockers(attack);
            this.attackTable[i] = new Array(1 << this.popCount(attack));

            for (let blocker of blockers) {
                const key = this.getMagicIndex(blocker, this.magicNumbers[i], this.magicShifts[i]);
                
                
                this.attackTable[i][key] = this.calculateRookAttacks(i, blocker);
            }
        }
    }
    getRookMask(fromTile: number) {
        let mask = 0n;
        // Don't include the rook's square: let square = 1n << BigInt(fromTile)
        let rank = Math.floor(fromTile / 8);
        let file = fromTile % 8;
    
        // Right
        for (let i = 1; i < (7 - file); i++) {
            mask |= 1n << BigInt(fromTile + i);
        }
        // Left
        for (let i = 1; i < file; i++) {
            mask |= 1n << BigInt(fromTile - i);
        }
        // Up
        for (let i = 1; i < (7 - rank); i++) {
            mask |= 1n << BigInt(fromTile + (8 * i));
        }
        // Down
        for (let i = 1; i < rank; i++) {
            mask |= 1n << BigInt(fromTile - (8 * i));
        }
        return mask;
    }
    getAltRookMask(fromTile: number) {
        let mask = 0n;
        // Don't include the rook's square: let square = 1n << BigInt(fromTile)
        let rank = Math.floor(fromTile / 8);
        let file = fromTile % 8;
    
        // Right
        for (let i = 1; i < (8 - file); i++) {
            mask |= 1n << BigInt(fromTile + i);
        }
        // Left
        for (let i = 1; i <= file; i++) {
            mask |= 1n << BigInt(fromTile - i);
        }
        // Up
        for (let i = 1; i < (8 - rank); i++) {
            mask |= 1n << BigInt(fromTile + (8 * i));
        }
        // Down
        for (let i = 1; i <= rank; i++) {
            mask |= 1n << BigInt(fromTile - (8 * i));
        }
        return mask;
    }
    getRookBlockers(attack: bigint) {
        let blockers = []
        let bitIndexes = []
        for (let i = 0; i < 64; i++) {
            if ((attack & 1n << BigInt(i)) != 0n) {
                bitIndexes.push(i)
            }
        }
        const totalPatterns = Math.pow(2, bitIndexes.length)
        for (let i = 0; i < totalPatterns; i++) {
            let pat = 0n
            for (let j = 0; j < bitIndexes.length; j++) {
                if ((i & (1 << j)) != 0) {
                    pat |= 1n << BigInt(bitIndexes[j])
                }
            }
            blockers.push(pat)
        }
        return blockers
    }
    calculateMagicShifts(): number[] {
        const magicShifts = new Array(64);
        /*
        [
            52, 53, 53, 53, 53, 53, 53, 52, 
            53, 54, 54, 54, 54, 54, 54, 53, 
            53, 54, 54, 54, 54, 54, 54, 53,
            53, 54, 54, 54, 54, 54, 54, 53, 
            53, 54, 54, 54, 54, 54, 54, 53, 
            53, 54, 54, 54, 54, 54, 54, 53,
            53, 54, 54, 54, 54, 54, 54, 53, 
            52, 53, 53, 53, 53, 53, 53, 52
            ]
        */

        for (let square = 0; square < 64; square++) {
            const mask = this.getRookMask(square);
            let relevantBits = 0;
            let tempMask = mask;
            while (tempMask !== 0n) {
                relevantBits++;
                tempMask &= tempMask - 1n;
            }
            magicShifts[square] = 64 - relevantBits;
        }
        return magicShifts;
    }
    calculateRookAttacks(square: number, blockers: bigint): bigint {
        let attacks = 0n;
        let rank = Math.floor(square / 8);
        let file = square % 8;

        // Right
        for (let i = 1; i < (8 - file); i++) {
            const mask = 1n << BigInt(square + i)
            if ((blockers & mask) !== 0n){
                attacks |= mask
                break;
            } 
            attacks |= mask
        }
        // Left
        for (let i = 1; i <= file; i++) {
            const mask = 1n << BigInt(square - i)
            if ((blockers & mask) !== 0n){
                attacks |= mask
                break;
            } 
            attacks |= mask
        }
        // Up
        for (let i = 1; i < (8 - rank); i++) {
            const mask = 1n << BigInt(square + 8 * i)
            if ((blockers & mask) !== 0n){
                attacks |= mask
                break;
            } 
            attacks |= mask
        }
        // Down
        for (let i = 1; i <= rank; i++) {
            const mask = 1n << BigInt(square - 8 * i)
            if ((blockers & mask) !== 0n){
                attacks |= mask
                break;
            } 
            attacks |= mask
        }
        return attacks;
    }
    popCount(x: bigint): number {
        let count = 0;
        while (x !== 0n) {
            count++;
            x &= x - 1n;
        }
        return count;
    }
    getMagicIndex(blockers: bigint, magic: bigint, shift: number): number {
        let index = Number((blockers * magic) >> BigInt(shift)) >>>0;
        index &= ((1<< 14)-1)
        return index 
    }
    printBit(bit: BigInt) {
        return bit.toString(2).padStart(64, '0')
    }
    printBoard(bit: BigInt) {
        let bitString = bit.toString(2).padStart(64, '0')
        for (let i = 0; i < bitString.length; i += 8) {
            console.log(bitString.slice(i, i + 8))
        }
    }
}

export default RookMagicGenerator