import AIPLayer from "./AIPlayer"
import GameRunner from "./gameRunner"
import { GameColor, GameType } from "./routeHandlers/helper"

class Stockfish{
    
    async getBestMove(fenString: string){
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
            return  response.json(); // or response.text() for other data types
        })
        .then(data =>{
            console.log(data)
            return data 
        })
    }
}
let a = new Stockfish()
a.getBestMove("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 1")