import { Piece } from "./Piece";
import { Color,PieceMoveType } from "./Piece";

export class Action{
    piece: Piece;
    constructor(piece:Piece){
        this.piece = piece;
    }
}
const dir_map = {
    forward:{x:1,y:0},
    backward:{x:-1,y:0},
    top_left:{x:1,y:-1},
    top_right:{x:1,y:1},
    bot_left:{x:-1,y:-1},
    bot_right:{x:-1,y:1}
}


export class ActionGenerator{
    instance:number = 0;
    constructor(){
        if(this.instance>1){return this}
        else{this.instance+=1 }
    }
    static generateMoveAction(piece:Piece,currentBoardState:Piece[]){
        let actions = []
        //generate in all directions then prune based off piece?
        for(let direction in piece.posMoves){//generate a move action in each direction for each square it can move to
            for(let i =1; i<= piece.moveLimit;i++){
                let property  = piece.posMoves[direction as keyof PieceMoveType]
                if(property.bool){
                    let calcX = piece.posX-(property.x*piece.color*i)
                    let calcY = piece.posY-(property.y*piece.color*i)
                    if(calcX >8 || calcX <1 || calcY >8 || calcY <1){continue}
                    actions.push(new MoveAction(piece,calcX,calcY))
                    let bPiece = currentBoardState.find((cPiece)=> cPiece.posX===calcX&&cPiece.posY === calcY)
                    if(bPiece){break}//break out of loop if we find a piece in the way

                }
                
            }
        }
        return actions
    }
}
export class KillAction extends Action{
    pieceToKill:Piece
    constructor(piece:Piece,pieceToKill:Piece){
        super(piece)
        this.pieceToKill = pieceToKill
    }
    execute(currentBoardState:Piece[]){
        let pieceIdx = currentBoardState.indexOf(this.pieceToKill);
        if(pieceIdx<0){
            console.log("ERROR: KILL 101")
            return currentBoardState
        }
        console.log(pieceIdx,this.pieceToKill,this.piece)
        currentBoardState.splice(pieceIdx,1)
        return currentBoardState;
    }
}
export class MoveAction extends Action{
    newPosX:number;
    newPosY:number;
    constructor(piece:Piece,newPosX:number,newPosY:number){
        super(piece);
        this.newPosX = newPosX;
        this.newPosY = newPosY
    }
    execute(currentBoardState:Piece[]):Piece[]{
        //if kill action
        
        let bkillPieceRef = currentBoardState.find((bPiece)=>this.newPosX === bPiece.posX && this.newPosY===bPiece.posY)
        console.log(currentBoardState,this.piece,this.newPosX,this.newPosY,bkillPieceRef)
        if(bkillPieceRef){
            if(bkillPieceRef.color === this.piece.color){return currentBoardState}
            let kill = new KillAction(this.piece,bkillPieceRef);
            currentBoardState = kill.execute(currentBoardState);
            console.log(currentBoardState)
        }

        let bPieceRef = currentBoardState.find((bPiece)=>this.piece.posX === bPiece.posX && this.piece.posY===bPiece.posY)
        if(!bPieceRef){return currentBoardState}
        
        bPieceRef.posX = this.newPosX;
        bPieceRef.posY = this.newPosY;
        return currentBoardState;
    }
}

