import { Piece } from "./Piece";
import { Color } from "./Piece";

export class Action{
    piece: Piece;
    constructor(piece:Piece){
        this.piece = piece;
    }
}
export class MoveAction extends Action{
    execute(currentBoardState:Piece[],newPosX:number,newPosY:number){}
}

export class MarchAction extends MoveAction{
    ready:number;
    
    //if 0 then no march actions available
    constructor(piece:Piece){
        super(piece);
        this.ready = 1;
        
    }
    execute(currentBoardState:Piece[],newPosX:number,newPosY:number){
        let dir = (this.piece.color===Color.WHITE)? 1:-1;
        //TODO: X AND Y are swapped everywhere. should fix eventually
        if(this.ready<1){throw new Error("Cannot march same pawn twice in a game")}
        if(this.piece.posY-newPosY!==0){
            throw new Error("Pawns cannot move horizontally")
        }
        if(dir*(this.piece.posX-newPosX)>0 && dir*(this.piece.posX-newPosX)<=2){
            
            return;
        }
    }
}
