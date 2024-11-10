import activeMatches from "./routeHandlers/helper";

function handleMove(gameID:number,from:number,to:number){
    const bitboard = activeMatches.get(gameID)
    if(!bitboard){
        console.log('cannot find bitboard')
        return ''
    }

    bitboard?.makeMove(from,to)
    let bitString =bitboard?.convertToString()
    return bitString?.split("").reverse().join("")
}
export {handleMove}