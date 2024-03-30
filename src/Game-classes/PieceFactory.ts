import { Bishop, Color, King, Knight, Pawn, Piece, Queen, Rook } from "./Piece";

export const pieceIdToFactory = (pieceId:number)=>{//this is terrible replace sometime in the future
    switch(pieceId){
        case 1:
            return new PawnFactory();
        case 2:
            return new RookFactory();
        case 3:
            return new KnightFactory();
        case 4:
            return new BishopFactory();
        case 5:
            return new QueenFactory();
        case 6:
            return new KingFactory();
        
    }
}

export  abstract class PieceFactory{
    public abstract createPiece(color:Color,xPos:number,yPos:number):Piece
    public replicatePiece(color:Color,xPos:number,yPos:number){
        return this.createPiece(color,xPos,yPos)
    }
}
export class PawnFactory extends PieceFactory{
    public createPiece(color:Color,xPos:number,yPos:number): Piece {
        return new Pawn(color,xPos,yPos);

    }
}
export class RookFactory extends PieceFactory{
    public createPiece(color:Color,xPos:number,yPos:number): Piece {
        return new Rook(color,xPos,yPos);

    }
}
export class KnightFactory extends PieceFactory{
    public createPiece(color:Color,xPos:number,yPos:number): Piece {
        return new Knight(color,xPos,yPos);

    }
}
export class BishopFactory extends PieceFactory{
    public createPiece(color:Color,xPos:number,yPos:number): Piece {
        return new Bishop(color,xPos,yPos);

    }
}
export class QueenFactory extends PieceFactory{
    public createPiece(color:Color,xPos:number,yPos:number): Piece {
        return new Queen(color,xPos,yPos);

    }
}
export class KingFactory extends PieceFactory{
    public createPiece(color:Color,xPos:number,yPos:number): Piece {
        return new King(color,xPos,yPos);

    }
}








