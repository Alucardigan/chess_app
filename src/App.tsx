import React, { useContext } from 'react';
import './App.css';
import ChessBoard from './Components/ChessBoard';
import { Game} from './Game-classes/Game';
import { createContext,useState } from 'react';
import GameContext from './Game-classes/GameContext';


function App() {
  const GameState = useContext(GameContext);
  let newGame = new Game();
  newGame.selectTile(1,1);
  const [gameEngine,setGameState] = useState(newGame);
  

  let newBoardState = gameEngine.currentBoardState.getBoardState()


  return (
    <div className="App">
      <GameContext.Provider value={gameEngine}>
        <ChessBoard gameBoardState={newBoardState}/>
      </GameContext.Provider>
      
    </div>
  );
}

export default App;

