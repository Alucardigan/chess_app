/*
Game pieces file
*/
class Piece{
    color: Color;
    posX:number;
    posY:number;
    imageLink:string|undefined;
    constructor(color:Color,posX:number,posY:number){
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.imageLink = undefined;
    }
      
}
enum Color{
    WHITE = 1,
    BLACK = 0,
    UNASSIGNED = -1
}

class Pawn extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color) ? "w_pawn.png":"b_pawn.png" 
    }
}

class Rook extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color) ? "w_rook.png":"b_rook.png" 
    }
}
class Knight extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color) ? "w_knight.png":"b_knight.png" 
    }
}
class Bishop extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color) ? "w_bishop.png":"b_bishop.png" 
    }
}
class Queen extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color) ? "w_queen.png":"b_queen.png" 
    }
}
class King extends Piece{
    imageLink:string;

    constructor(color:Color,posX:number,posY:number){
        super(color,posX,posY);
        this.imageLink = (color) ? "w_king.png":"b_king.png" 
    }
}
export {Pawn,Rook,Knight,Bishop,Queen,King,Color,Piece}