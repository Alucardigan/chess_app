import activeMatches from "./routeHandlers/helper";

function handleMove(gameID:number,userID:String , from:number,to:number){
    
    const game = activeMatches.get(Number(gameID))//unsure why type casting is required here but it is 
    if(!game){
        console.log('cannot find bitboard')
        return ''
    }
    let userWhoseTurnItIs= game.getPlayerByTurn()
    if(!userWhoseTurnItIs){
        console.log("User cannot be found")
        return 
    }
    if(userWhoseTurnItIs!==userID){
        console.log("Incorrect user: Blocked")
        return
    }


    game?.makeMove(from,to)
    let bitString =game.gameStates[game.gameStates.length-1].convertToString()
    return bitString?.split("").reverse().join("")
}
export {handleMove}