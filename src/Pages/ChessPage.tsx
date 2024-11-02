
import { useParams } from "react-router-dom"
import ChessBoard from "../Components/Chessboard"
import { useState } from "react"


function ChessPage(){
    //get the game state from game ID via request to backend
    const {gameID} = useParams()
    const [boardState,setBoardState] = useState("RNBQKBNRPPPPPPPP................................pppppppprnbkqbnr")
    
    return (
    <div>{gameID}
        <div className="chessboard">
            <ChessBoard boardState={boardState}/>
        </div>
    </div>
    )

}
export default ChessPage;