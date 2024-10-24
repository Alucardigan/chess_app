import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Pages/LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandingPage/>
    </>
  )
}

export default App
