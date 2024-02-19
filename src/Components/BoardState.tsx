import { Piece } from "../Game-classes/Piece";
import { Player } from "../Game-classes/Player";
class BoardState{
    boardState: Piece[]
    constructor(){
        this.boardState = []
    }
    updateBoardState(players:Player[]){
        for(let i =0;i<players.length;i++){
            let player = players[i];
            this.boardState = this.boardState.concat(player.pieces);
        }
    }
    getBoardState(){
        return this.boardState;
    }
}
export {BoardState}