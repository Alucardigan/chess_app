import { BlackPlayer, Player, WhitePlayer } from "./Player";


class Game{
    turns: number;
    players: Player[]
    currentPlayer:Player
    constructor(){
        this.turns = 0;
        this.players = this.intialisePlayers();
        this.currentPlayer = this.determinePlayer();
    }
    private intialisePlayers():Player[]{
        let playerWhite = new WhitePlayer();
        let playerBlack = new BlackPlayer();
        return [playerWhite,playerBlack];
    }
    private determinePlayer():Player{
        return (this.turns%2) ? this.players[0] : this.players[1]; 
    }
    
    selectTile(tileX:number,tileY:number){
        this.currentPlayer = this.determinePlayer();
        
    }

    
}

export {Game};