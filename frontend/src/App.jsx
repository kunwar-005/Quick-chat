import { useContext, useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/homepage.jsx'
import Loginpage from './pages/Loginpage.jsx'
import Porfile from './pages/Profile.jsx'
import { Toaster } from 'react-hot-toast'

import { Authcontext } from '../context/authcontext.jsx'
function App() {
  
  const {authUser}= useContext(Authcontext)  

  return (
    <div className="bg-[url('./assets/bgImage.png')] bg-cover bg-no-repeat min-h-screen">
      <Toaster/>
     <Routes>
      <Route path='/' element={authUser?<Homepage />: <Navigate to="/login" />} />
      <Route path='/login' element={!authUser?<Loginpage />: <Navigate to="/" />} />
      <Route path='/profile' element={authUser?<Porfile />: <Navigate to="/login"/>} />
     </Routes>
    </div>
  )
}

export default App
