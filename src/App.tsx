import React, { useContext,useState } from 'react';
import './App.css';
import ChessBoard from './Components/ChessBoard';
import { Game} from './Game-classes/Game';
import GameContext from './Game-classes/GameContext';


function App() {
  let [gameState,setGameState] = useState(new Game());


  return (
    <div className="App">
      <GameContext.Provider value={{gameState,setGameState}}>
        <ChessBoard></ChessBoard>
      </GameContext.Provider>
      
    </div>
  );
}

export default App;

