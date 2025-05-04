import AIPLayer from "./AIPlayer"
import GameRunner from "./gameRunner"
import { GameColor, GameType } from "./routeHandlers/helper"

export default class Stockfish{
    
    static async getBestMove(fenString: string): Promise<{from:number,to:number}>{
        const endPoint ="https://stockfish.online/api/s/v2.php" 
        const queryParams = new URLSearchParams({
            fen: fenString,
            depth : "12" 

        })
        return  fetch(`${endPoint}?${queryParams}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return  response.json() as Promise<{bestmove:string}>; // or response.text() for other data types
        })
        .then((data:{bestmove:string}) =>{
            let bestMove:string = data['bestmove'].split(" ")[1]
            let movementSquares = []
            let square = 0
            for(let i = 0; i < bestMove.length;i++){
                if(bestMove.charCodeAt(i)>57){//letters 
                    square += bestMove.charCodeAt(i)-97
                }
                else{
                    square += 8*(8 - Number(bestMove[i]))
                    movementSquares.push(square)
                    square = 0
                }
            }
            console.log('stockfish',movementSquares)
            return {from: movementSquares[0],to:movementSquares[1]} 
        })
    }
}
