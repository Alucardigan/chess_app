import { Action, ActionGenerator, MoveAction } from "./Actions";

/*
Game pieces file
*/
class DirectionMap{
    bool:boolean
    x:number
    y:number
    constructor(bool:boolean,x:number,y:number){
        this.bool = bool;
        this.x = x;
        this.y = y
    }
}
export interface PieceMoveType{
    forward: DirectionMap,
    backward: DirectionMap,
    top_left: DirectionMap,
    top_right: DirectionMap,
    bot_left: DirectionMap,
    bot_right: DirectionMap,
    right: DirectionMap,
    left: DirectionMap,
}
class Piece{
    color: Color;
    posX:number;
    posY:number;
    imageLink:string|undefined;
    moveActions:MoveAction[];
    moveLimit:number
    posMoves:PieceMoveType
    jump: boolean
    pieceTypeID: number
    constructor(color:Color,posX:number,posY:number){
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.imageLink = undefined;
        this.moveActions = [];
        this.moveLimit = 8
        this.posMoves = {
            forward:new DirectionMap(false,1,0),
            backward:new DirectionMap(false,-1,0),
            top_left:new DirectionMap(false,1,-1),
            top_right:new DirectionMap(false,1,1),
            bot_left:new DirectionMap(false,-1,-1),
            bot_right:new DirectionMap(false,-1,1),
            right: new DirectionMap(false,0,1),
            left: new DirectionMap(false,0,-1),
        }
        this.jump = false;
        this.pieceTypeID = 0
    }
    move(currentBoardState:Piece[],newPosX:number,newPosY:number){
        let actions  = this.generateMoveLogic(currentBoardState);
        let foundAction = actions.find((action)=> action.newPosX===newPosX&&action.newPosY===newPosY)
        console.log(foundAction,actions,newPosX,newPosY)
        if(!foundAction){return currentBoardState}
        let newBoardState = foundAction.execute(currentBoardState)
        return newBoardState
    }
    generateMoveLogic(currentBoardState:Piece[]){
        //seperating the action generation logic
        return ActionGenerator.generateMoveAction(this, currentBoardState)
    }
    
    
      
}
enum Color{
    WHITE = 1,
    BLACK = -1,
    UNASSIGNED = 0
}

class Pawn extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color>0) ? "w_pawn.png":"b_pawn.png" 
        this.moveLimit = 2
        this.posMoves.forward.bool =  true;
        this.posMoves.top_left.bool = true;
        this.posMoves.top_right.bool = true;
        this.pieceTypeID = 1;
        
    }
    move(currentBoardState:Piece[],newPosX:number,newPosY:number){
        
        let newBoardState = super.move(currentBoardState,newPosX,newPosY)
        if(this.moveLimit>1){this.moveLimit-=1}
        return newBoardState
    }
    generateMoveLogic(currentBoardState: Piece[]){
        let actions = super.generateMoveLogic(currentBoardState);
        for(let i = actions.length-1;i>=0;i--){
            let fPiece = currentBoardState.find((piece)=>piece.posX===actions[i].newPosX&&piece.posY===actions[i].newPosY)
            if(Math.abs(actions[i].newPosY - this.posY)>1){
                actions.splice(i,1)//remove from list if you are trying to do 2 step diagonal
            }
            
            else if(Math.abs(actions[i].newPosY - this.posY)>0){
                
                if(!fPiece){actions.splice(i,1)}//remove diagonals if there is no piece
                continue;
            }
            else if(Math.abs(actions[i].newPosX - this.posX)>0){
                if(fPiece){actions.splice(i,1)}
            }
        }
        return actions;
    }
}

class Rook extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color>0) ? "w_rook.png":"b_rook.png" 
        this.posMoves.forward.bool = true;
        this.posMoves.backward.bool = true;
        this.posMoves.left.bool = true;
        this.posMoves.right.bool = true;
        this.pieceTypeID = 2

    }
}
class Knight extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color>0) ? "w_knight.png":"b_knight.png" 
        this.posMoves.forward.bool = true;
        this.posMoves.backward.bool = true;
        this.posMoves.left.bool = true;
        this.posMoves.right.bool = true;
        this.jump = true
        this.pieceTypeID = 3;
    }
    generateMoveLogic(currentBoardState: Piece[]): MoveAction[] {
        return ActionGenerator.generateJumpAction(this,currentBoardState);
    }
}
class Bishop extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color>0) ? "w_bishop.png":"b_bishop.png" 
        this.posMoves.bot_left.bool = true;
        this.posMoves.bot_right.bool = true;
        this.posMoves.top_left.bool = true;
        this.posMoves.top_right.bool = true;
        this.pieceTypeID = 4;
    }
}
class Queen extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color>0) ? "w_queen.png":"b_queen.png" 
        this.posMoves.bot_left.bool = true;
        this.posMoves.bot_right.bool = true;
        this.posMoves.top_left.bool = true;
        this.posMoves.top_right.bool = true;
        this.posMoves.forward.bool = true;
        this.posMoves.backward.bool = true;
        this.posMoves.left.bool = true;
        this.posMoves.right.bool = true;
        this.pieceTypeID = 5;

    }
}
class King extends Piece{
    imageLink:string;
    inCheck:boolean

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color>0) ? "w_king.png":"b_king.png" 
        this.moveLimit =1;
        this.posMoves.bot_left.bool = true;
        this.posMoves.bot_right.bool = true;
        this.posMoves.top_left.bool = true;
        this.posMoves.top_right.bool = true;
        this.posMoves.forward.bool = true;
        this.posMoves.backward.bool = true;
        this.posMoves.left.bool = true;
        this.posMoves.right.bool = true;
        this.inCheck = false;
        this.pieceTypeID = 6;
    }

    checkInCheck(currentBoardState:Piece[],curX:number=this.posX,curY:number=this.posY,){
        for(let i = 0;i<currentBoardState.length;i++){
            let piece = currentBoardState[i]
            if(piece.color!==this.color && this.pieceTypeID!==piece.pieceTypeID){
                let actions = piece.generateMoveLogic(currentBoardState);
                for(let j = 0; j<actions.length;j++){
                    if(actions[j].newPosX===curX && actions[j].newPosY===curY){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    generateMoveLogic(currentBoardState: Piece[]): MoveAction[] {
        let actions = super.generateMoveLogic(currentBoardState);
        for(let i = actions.length-1;i>=0;i--){
            if(this.checkInCheck(currentBoardState,actions[i].newPosX,actions[i].newPosY)){
                actions.splice(i,1);//remove the action if it leads you to check
            }
        }
        return actions;
    }

}
export {Pawn,Rook,Knight,Bishop,Queen,King,Color,Piece}