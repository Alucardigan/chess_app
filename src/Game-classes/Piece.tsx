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
    }
    move(currentBoardState:Piece[],newPosX:number,newPosY:number){
        let actions  = this.generateMoveLogic(currentBoardState);
        let foundAction = actions.find((action)=> action.newPosX===newPosX&&action.newPosY===newPosY)
        console.log(foundAction,actions,newPosX,newPosY)
        if(!foundAction){return currentBoardState}
        console.log(foundAction)
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
        
    }
    move(currentBoardState:Piece[],newPosX:number,newPosY:number){
        
        let newBoardState = super.move(currentBoardState,newPosX,newPosY)
        if(this.moveLimit>1){this.moveLimit-=1}
        return newBoardState
    }
    generateMoveLogic(currentBoardState: Piece[]){
        let actions = super.generateMoveLogic(currentBoardState);
        for(let i = actions.length-1;i>=0;i--){
            if(Math.abs(actions[i].newPosY - this.posY)>1){
                actions.splice(i,1)//remove from list if you are trying to do 2 step diagonal
            }
            else if(Math.abs(actions[i].newPosY - this.posY)>0){
                let fPiece = currentBoardState.find((piece)=>piece.posX===actions[i].newPosX&&piece.posY===actions[i].newPosY)
                if(!fPiece){actions.splice(i,1)}//remove diagonals if there is no piece
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
    }
}
class King extends Piece{
    imageLink:string;

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
    }
}
export {Pawn,Rook,Knight,Bishop,Queen,King,Color,Piece}