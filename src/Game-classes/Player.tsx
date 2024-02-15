
import { Pawn,Rook,Knight,Bishop,Queen,King,Color,Piece} from "./Piece"
class Player{
    color:Color;
    pieces: Piece[];
    constructor(){
        this.color = Color.UNASSIGNED;
        this.pieces = []
        
    };
    intialisePawns(PawnRow:number,PawnColumnStart:number,PawnColumnEnd:number){
        let pawnArray = []
        for(let i = PawnColumnStart; i <=PawnColumnEnd;i++){
            let pawn = new Pawn(this.color,PawnRow,i);          
            pawnArray.push(pawn);
        }
        return pawnArray;
    }
    intialiseQueen(QueenX:number,QueenY:number){
        return [new Queen((this.color),QueenX,QueenY)]
    }
    intialiseRooks(RookX:number,RookY:number[]){
        let RookArray  = []
        for(let i = 0;i<RookY.length;i++){
            RookArray.push(new Rook(this.color,RookX,RookY[i]))
        }
        return RookArray
    }
    intialiseKnights(KnightX:number,KnightY:number[]){
        let KnightArray  = []
        for(let i = 0;i<KnightY.length;i++){
            KnightArray.push(new Knight(this.color,KnightX,KnightY[i]))
        }
        return KnightArray
    }
    intialiseBishops(BishopX:number,BishopY:number[]){
        let BishopArray = []
        for(let i = 0;i<BishopY.length;i++){
            BishopArray.push(new Bishop(this.color,BishopX,BishopY[i]))
        }
        return BishopArray;
    }
    intialiseKing(KingX:number,KingY:number){
        return [new King((this.color),KingX,KingY)]
    }
}

class WhitePlayer extends Player{
    color:Color;
    constructor(){
        super();
        this.color = Color.WHITE; 
        this.pieces = []
        this.pieces = this.pieces.concat(this.intialisePawns())
        this.pieces = this.pieces.concat(this.intialiseQueen())
        this.pieces = this.pieces.concat(this.intialiseRooks())
        this.pieces = this.pieces.concat(this.intialiseKnights())
        this.pieces = this.pieces.concat(this.intialiseBishops())
        this.pieces = this.pieces.concat(this.intialiseKing())
    }
    
    intialisePawns(){
        const PawnRow = 7;
        const PawnColumnEnd = 8;
        const PawnColumnStart = 1;
        
        return super.intialisePawns(PawnRow,PawnColumnStart,PawnColumnEnd);
    }
    intialiseQueen(){
        const QueenX = 8;
        const QueenY = 4;
        return super.intialiseQueen(QueenX,QueenY);
    }
    intialiseRooks(){
        const RookX = 8;
        const RookY = [1,8]
        return super.intialiseRooks(RookX,RookY);
        
    }
    intialiseKnights(){
        const KnightX = 8;
        const KnightY = [2,7]
        return super.intialiseKnights(KnightX,KnightY);
        
    }
    intialiseBishops(){
        const BishopX = 8;
        const BishopY = [3,6]
        return super.intialiseBishops(BishopX,BishopY);
        
    }
    intialiseKing(){
        const KingX = 8;
        const KingY = 5;
        return super.intialiseKing(KingX,KingY)
    }
}
class BlackPlayer extends Player{
    color:Color;
    constructor(){
        super();
        this.color = Color.BLACK; 
        this.pieces = []
        this.pieces = this.pieces.concat(this.intialisePawns())
        this.pieces = this.pieces.concat(this.intialiseQueen())
        this.pieces = this.pieces.concat(this.intialiseRooks())
        this.pieces = this.pieces.concat(this.intialiseKnights())
        this.pieces = this.pieces.concat(this.intialiseBishops())
        this.pieces = this.pieces.concat(this.intialiseKing())
    }
    
    intialisePawns(){
        const PawnRow = 2;
        const PawnColumnEnd = 8;
        const PawnColumnStart = 1;
        
        return super.intialisePawns(PawnRow,PawnColumnStart,PawnColumnEnd);
    }
    intialiseQueen(){
        const QueenX = 1;
        const QueenY = 5;
        return super.intialiseQueen(QueenX,QueenY);
    }
    intialiseRooks(){
        const RookX = 1;
        const RookY = [1,8]
        return super.intialiseRooks(RookX,RookY);
        
    }
    intialiseKnights(){
        const KnightX = 1;
        const KnightY = [2,7]
        return super.intialiseKnights(KnightX,KnightY);
        
    }
    intialiseBishops(){
        const BishopX = 1;
        const BishopY = [3,6]
        return super.intialiseBishops(BishopX,BishopY);
        
    }
    intialiseKing(){
        const KingX = 1;
        const KingY = 4;
        return super.intialiseKing(KingX,KingY)
    }
}


export {Player,WhitePlayer,BlackPlayer}