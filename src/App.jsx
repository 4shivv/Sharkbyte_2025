import { useState } from 'react'
import { Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.css'

import SignInPage from './Pages/SignInPage'
import LoginInPage from './Pages/LoginInPage'
import { RootLayout } from './Layouts/RootLayout'
import Homepage from './Pages/HomePage' 
import CheckIn from './Pages/CheckIn'
import { Appointments } from './components/CheckIn/Appointments'
import { Insurance } from './components/CheckIn/Insurance'
import { Records } from './components/CheckIn/Records'
import { Questions } from './components/CheckIn/Questions'
import { Chat } from './Pages/Chat'
import { Map } from './Pages/Map'
import SpendingPage from './Pages/Spending'
import { Analytics } from './Pages/Analytics'
import { Footer } from './components/Footer'



function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}>
          <Route index element={<Homepage/>}/>
          <Route path='footer' element={<Footer/>}/>
          <Route path='/login' element={<LoginInPage/>}/>
          <Route path='/signup' element={<SignInPage/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/spending' element={<SpendingPage/>}/>
          <Route path='/analytics' element={<Analytics/>}/>
          <Route path="/map" element={<Map />}>
            
          </Route>
          
      </Route>
    )
  )

  return (
    
      <RouterProvider router={router}/>

    
  )
}


export default App
