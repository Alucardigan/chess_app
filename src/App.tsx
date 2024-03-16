import React, { useContext,useState } from 'react';
import './App.css';
import ChessBoard from './Components/ChessBoard';
import { Game} from './Game-classes/Game';
import GameContext from './Game-classes/GameContext';
import { RoomPage } from './Pages/CreateRoomPage';
import { ChakraBaseProvider, Switch } from '@chakra-ui/react';
import { ChessBoardPage } from './Pages/ChessboardPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';



function App() {
  let [gameState,setGameState] = useState(new Game());
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chessboard/:roomId" element={<ChessBoardPage/>}/>
        <Route index element={<HomePage/>}/>
      </Routes>

    </BrowserRouter>
    
    
  );
}

export default App;

