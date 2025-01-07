import BitBoard from "./bitboard";

class MoveGenerator{
    //color = 0 if black or 6 if white
    generatePawnMoves(bitboard:BitBoard,color:number,fromTile:number){
        let moves = 0n
        let pawns  = bitboard.boardState[color ]
        pawns = pawns & (1n<<BigInt(fromTile))
        //single move
        let move = color == 0 ? pawns<<8n : pawns >> 8n
        const pieceBlocks = bitboard.getAllPieces()
        const emptyspaces = pieceBlocks^0b1111111111111111111111111111111111111111111111111111111111111111n
        move &=emptyspaces
        moves |=move
        //double move
        if((color==0 && fromTile>=8 &&fromTile <=15)||(color==6 && fromTile>=48 && fromTile <=55)){
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
            let move = fromTile%8==0 ? pawns : (pawns << 7n) & whitePieces
            captures |=move
            move = (fromTile+1)%8 == 0 ? pawns : (pawns << 9n) & whitePieces
            captures |= move
        }
        else{
            const blackPieces = bitboard.getBlackPieces()
            let move = fromTile%8==0 ? pawns : (pawns >>9n) & blackPieces
            captures |=move
            move = (fromTile+1)%8 == 0 ? pawns : (pawns >> 7n) & blackPieces
            captures |= move
        }
        return {moves,captures}
    }
    generateBishopMoves(){
        let AttackTable = []
        for(let i = 0; i <64; i++){
            let attack = this.getBishopMask(i)
            let blockers = this.getBishopBlockers(attack)
            this.printBoard(attack)
            for(let blocker of blockers){
                let legalAttack = attack ^ blocker
                this.printBoard(legalAttack)

                let tile = 1n<<BigInt(i)
                let rank = Math.floor(i/8)
                let file = i%8
                console.log(rank,file,i)
                for(let j = 1; j <= Math.min(rank,7-file);j++){
                    
                }
                
            }
            break;
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
let a = new MoveGenerator()
a.generateBishopMoves()
export default MoveGenerator
