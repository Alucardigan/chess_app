import activeMatches from "./routeHandlers/helper";

function handleMove(gameID:number,from:number,to:number){
    const bitboard = activeMatches.get(gameID)
    console.log(activeMatches)
    if(!bitboard){
        console.log('cannot find bitboard')
        return ''
    }
    console.log(gameID,bitboard,activeMatches)
    bitboard?.makeMove(from,to)
    let bitString =bitboard?.convertToString()
    return bitString?.split("").reverse().join("")
}
export {handleMove}