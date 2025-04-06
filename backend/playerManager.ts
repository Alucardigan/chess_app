import { randomUUID } from "crypto";
import { GameColor } from "./routeHandlers/helper";

interface PlayerInfo{
    userName: String
    color: GameColor
}

class PlayerManager{
    players: Map <String,PlayerInfo>
    takenColors: GameColor[] 
    constructor(){
        this.players = new Map()
        this.takenColors = []
    }
    addPlayer(username:String,color:GameColor){
        //TODO: Add a way where if color is undefined then player can be assigned whatever color is leftover
        if(color in this.takenColors){
            console.log("Color taken")
            return
        }
        const UID = this.generatePlayerID()
        this.players.set(UID,{userName:username,color:color})
        this.takenColors.push(color)
        return UID
    }
    removePlayer(UID:String){
        this.players.delete(UID)
    }
    generatePlayerID(){
        const UID = randomUUID()
        return UID
    }
    getPlayerByColor(color:GameColor){
        for(let [key] of this.players){
            if(this.players.get(key)?.color=== color){
                return key
            }
        }
        console.log("Couldnt find player by chosen color",color)
    }
}
export default PlayerManager;