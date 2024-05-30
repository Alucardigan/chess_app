
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
        let actions:MoveAction[] = []
        //generate in all directions then prune based off piece?
        for(let direction in piece.posMoves){//generate a move action in each direction for each square it can move to
            for(let i =1; i<= piece.moveLimit;i++){
                let property  = piece.posMoves[direction as keyof PieceMoveType]
                if(property.bool){
                    let calcX = piece.posX-(property.x*piece.color*i)
                    let calcY = piece.posY-(property.y*piece.color*i)
                    if(this.borderCheck(calcX,calcY)){continue}
                    let bPiece = currentBoardState.find((cPiece)=> cPiece.posX===calcX&&cPiece.posY === calcY)// is there a piece on this position
                    if(bPiece?.color===piece.color){break}//if the piece belongs to us then we dont generate an action for it
                    
                    actions.push(new MoveAction(piece,calcX,calcY))// if the piece doesnt belong to us, we generate an action but then break out to not gen more actions

                    
                    if(bPiece){break}//break out of loop if we find a piece in the way

                }
                
            }
        }
        return actions
    }
    static generateJumpAction(piece:Piece,currentBoardState:Piece[]){
        let actions:MoveAction[] = []
        if(!piece.jump){return actions}
        for(let direction in piece.posMoves){
            let property = piece.posMoves[direction as keyof PieceMoveType]
            if(property.bool){
                let calcX = piece.posX-(property.x*piece.color*2)
                let calcY = piece.posY-(property.y*piece.color*2)
                if(Math.abs(property.x)<1){
                    if(!this.borderCheck(calcX+1,calcY)){
                        actions.push(new MoveAction(piece,calcX+1,calcY))
                    }
                    if(!this.borderCheck(calcX-1,calcY)){
                        actions.push(new MoveAction(piece,calcX-1,calcY))
                    }
                }
                else if(Math.abs(property.y)<1){
                    if(!this.borderCheck(calcX,calcY+1)){
                        actions.push(new MoveAction(piece,calcX,calcY+1))
                    }
                    if(!this.borderCheck(calcX,calcY-1)){
                        actions.push(new MoveAction(piece,calcX,calcY-1))
                    }
                }
            }
            
        }
        return actions
    }
    static borderCheck(x:number,y:number){
        /*
        Funciton to calculate if a set of coords goes over the border limits 
        */
        if(x>8||x<1||y>8||y<1){
            return true;
        }
        
        return false;

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
        
        if(bkillPieceRef){
            if(bkillPieceRef.color === this.piece.color){return currentBoardState}
            let kill = new KillAction(this.piece,bkillPieceRef);
            currentBoardState = kill.execute(currentBoardState);
        }

        let bPieceRef = currentBoardState.find((bPiece)=>this.piece.posX === bPiece.posX && this.piece.posY===bPiece.posY)
        if(!bPieceRef){return currentBoardState}
        
        bPieceRef.posX = this.newPosX;
        bPieceRef.posY = this.newPosY;
        return currentBoardState;
    }
}

