import React from 'react';
import './App.css';
import ChessBoard from './Components/ChessBoard';
import { Game } from './Game-classes/Game';
import { BoardState } from './Components/ChessBoard';

function App() {
  const GameEngine = new Game();
  let newBoardState = new BoardState()
  newBoardState.updateBoardState(GameEngine.players)
  let newBoard = newBoardState.getBoardState();

  return (
    <div className="App">
      <ChessBoard gameBoardState={newBoard}/>
    </div>
  );
}

export default App;
