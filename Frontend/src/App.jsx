import { useState } from 'react'
import { Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
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

import { Analytics } from './Pages/Analytics'
import { Footer } from './components/Footer'

import AgentDashboard from './Pages/AgentDashboard.'
import AgentHistory from './Pages/History'
import ProjectOverview from './Pages/NewProject'
import AgentDetails from './Pages/AgentDetails'
import ScanResults from './Pages/ScanResults'

import { AuthProvider, useAuth } from './contexts/AuthContext'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};



// Wrapper component to provide AuthProvider inside the router
const AppContent = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<AppContent/>}>
          <Route index element={<Homepage/>}/>
          <Route path='footer' element={<Footer/>}/>
          {/* Public routes */}
          <Route path='/login' element={<LoginInPage/>}/>
          <Route path='/signup' element={<SignInPage/>}/>
          {/* Protected routes - require authentication */}
          <Route path='/agent-dashboard' element={
            <ProtectedRoute>
              <AgentDashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <AgentDashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/history' element={
            <ProtectedRoute>
              <AgentHistory/>
            </ProtectedRoute>
          }/>
          <Route path='/newproject' element={
            <ProtectedRoute>
              <ProjectOverview/>
            </ProtectedRoute>
          }/>
          <Route path='/agents/:agentId' element={
            <ProtectedRoute>
              <AgentDetails/>
            </ProtectedRoute>
          }/>
          <Route path='/scans/:scanId' element={
            <ProtectedRoute>
              <ScanResults/>
            </ProtectedRoute>
          }/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path="/map" element={<Map />} />
      </Route>
    )
  )

  return <RouterProvider router={router}/>
}


export default App
