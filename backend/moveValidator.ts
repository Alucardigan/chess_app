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
            let move = fromTile%8==0 ? pawns : (pawns >>7n) & blackPieces
            captures |=move
            move = (fromTile+1)%8 == 0 ? pawns : (pawns >> 9n) & blackPieces
            captures |= move
        }
        return {moves,captures}
    }
}
export default MoveGenerator