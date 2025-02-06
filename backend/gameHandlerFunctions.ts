import activeMatches from "./routeHandlers/helper";

function handleMove(gameID:number,from:number,to:number){
    const game = activeMatches.get(gameID)
    if(!game){
        console.log('cannot find bitboard')
        return ''
    }

    game?.makeMove(from,to)
    let bitString =game.gameStates[game.gameStates.length-1].convertToString()
    return bitString?.split("").reverse().join("")
}
export {handleMove}