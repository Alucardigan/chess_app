import React, { useContext,useState } from 'react';
import './App.css';
import ChessBoard from './Components/ChessBoard';

import { RoomPage } from './Pages/CreateRoomPage';
import { ChakraBaseProvider, Switch } from '@chakra-ui/react';
import { ChessBoardPage } from './Pages/ChessboardPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';
import { io } from 'socket.io-client';
import SocketContext from './Components/SocketContext';



function App() {
  const [socket,setSocket] = useState(io('http://localhost:8080'))
  return (
    <SocketContext.Provider value={{socket,setSocket}}>
      <BrowserRouter>
        <Routes>
          <Route path="/chessboard/:roomId" element={<ChessBoardPage/>}/>
          <Route index element={<HomePage/>}/>
        </Routes>

      </BrowserRouter>
    </SocketContext.Provider>
    
    
  );
}

export default App;

