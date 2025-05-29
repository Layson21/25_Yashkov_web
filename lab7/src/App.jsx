import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from './pages/Board'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Board />} />
      </Routes>
    </Router>
  )
}

export default App
