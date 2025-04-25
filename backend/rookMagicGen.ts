import { ROOK_MAGIC_NUMBERS } from "./magic";

class RookMagicGenerator {
    attackTable: bigint[][];
    magicShifts: number[];
    magicNumbers: bigint[];

    constructor() {
        this.attackTable = new Array(64);
        this.magicShifts = this.calculateMagicShifts();
        this.magicNumbers = ROOK_MAGIC_NUMBERS; // Use known-good magic numbers
        this.generateRookMoves();
    }

    // Generate magic numbers (optional, since you're using external ones)
    generateMagicNumbers() {
        this.magicNumbers = new Array(64);
        for (let square = 0; square < 64; square++) {
            const attackMask = this.getAltRookMask(square);
            const blockers = this.getRookBlockers(attackMask);
            let attempts = 0;
            const maxAttempts = 1000000; // Prevent infinite loops

            while (attempts < maxAttempts) {
                const candidateMagic = BigInt(Math.floor(Math.random() * 2 ** 64));
                const map = new Map<number, bigint>();
                let collision = false;

                for (const blocker of blockers) {
                    const key = this.getMagicIndex(blocker, candidateMagic, this.magicShifts[square]);
                    if (map.has(key)) {
                        collision = true;
                        break;
                    }
                    map.set(key, blocker);
                }

                if (!collision) {
                    this.magicNumbers[square] = candidateMagic;
                    break;
                }
                attempts++;
            }

            if (attempts >= maxAttempts) {
                console.error(`Failed to find magic number for square ${square}`);
                this.magicNumbers[square] = 0n; // Fallback (shouldn't happen with good masks)
            }
        }
    }

    generateRookMoves() {
        for (let square = 0; square < 64; square++) {
            const attackMask = this.getAltRookMask(square);
            const blockers = this.getRookBlockers(attackMask);
            const tableSize = 1 << this.popCount(attackMask);
            this.attackTable[square] = new Array(tableSize).fill(0n);

            for (const blocker of blockers) {
                const key = this.getMagicIndex(blocker, this.magicNumbers[square], this.magicShifts[square]);
                this.attackTable[square][key] = this.calculateRookAttacks(square, blocker);
            }
        }
    }

    getAltRookMask(square: number): bigint {
        let mask = 0n;
        const rank = Math.floor(square / 8);
        const file = square % 8;

        // Right (exclude rightmost edge unless rook is on it)
        for (let i = 1; i < 7 - file; i++) {
            mask |= 1n << BigInt(square + i);
        }
        // Left (exclude leftmost edge unless rook is on it)
        for (let i = 1; i < file; i++) {
            mask |= 1n << BigInt(square - i);
        }
        // Up (exclude top edge unless rook is on it)
        for (let i = 1; i < 7 - rank; i++) {
            mask |= 1n << BigInt(square + 8 * i);
        }
        // Down (exclude bottom edge unless rook is on it)
        for (let i = 1; i < rank; i++) {
            mask |= 1n << BigInt(square - 8 * i);
        }
        return mask;
    }

    getRookBlockers(attackMask: bigint): bigint[] {
        const blockers: bigint[] = [];
        const bitIndexes: number[] = [];
        for (let i = 0; i < 64; i++) {
            if ((attackMask & (1n << BigInt(i))) !== 0n) {
                bitIndexes.push(i);
            }
        }
        const totalPatterns = 1 << bitIndexes.length;
        for (let i = 0; i < totalPatterns; i++) {
            let pattern = 0n;
            for (let j = 0; j < bitIndexes.length; j++) {
                if ((i & (1 << j)) !== 0) {
                    pattern |= 1n << BigInt(bitIndexes[j]);
                }
            }
            blockers.push(pattern);
        }
        return blockers;
    }

    calculateMagicShifts(): number[] {
        const magicShifts = new Array(64);
        for (let square = 0; square < 64; square++) {
            const mask = this.getAltRookMask(square);
            const relevantBits = this.popCount(mask);
            magicShifts[square] = 64 - relevantBits;
        }
        return magicShifts;
    }

    calculateRookAttacks(square: number, blockers: bigint): bigint {
        let attacks = 0n;
        const rank = Math.floor(square / 8);
        const file = square % 8;

        // Right
        for (let i = 1; i <= 7 - file; i++) {
            const target = square + i;
            attacks |= 1n << BigInt(target);
            if ((blockers & (1n << BigInt(target))) !== 0n) break;
        }
        // Left
        for (let i = 1; i <= file; i++) {
            const target = square - i;
            attacks |= 1n << BigInt(target);
            if ((blockers & (1n << BigInt(target))) !== 0n) break;
        }
        // Up
        for (let i = 1; i <= 7 - rank; i++) {
            const target = square + 8 * i;
            attacks |= 1n << BigInt(target);
            if ((blockers & (1n << BigInt(target))) !== 0n) break;
        }
        // Down
        for (let i = 1; i <= rank; i++) {
            const target = square - 8 * i;
            attacks |= 1n << BigInt(target);
            if ((blockers & (1n << BigInt(target))) !== 0n) break;
        }
        return attacks;
    }

    popCount(x: bigint): number {
        return x.toString(2).match(/1/g)?.length || 0;
    }

    getMagicIndex(blockers: bigint, magic: bigint, shift: number): number {
        const product = blockers * magic;
        const shifted = product >> BigInt(shift);
        return Number(shifted);
    }

    printBit(bit: bigint): string {
        return bit.toString(2).padStart(64, "0");
    }

    printBoard(bit: bigint) {
        const bitString = this.printBit(bit);
        for (let i = 0; i < 8; i++) {
            console.log(bitString.slice(i * 8, (i + 1) * 8).split("").reverse().join(""));
        }
    }
}

export default RookMagicGenerator;