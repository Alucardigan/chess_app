
import './App.css'
import ChessPage from './Pages/ChessPage'
import LandingPage from './Pages/LandingPage'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/game/:gameID" element={<ChessPage/>}/>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
