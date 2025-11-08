import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Stepper from '../components/CheckIn/Stepper';

const CheckIn = () => {
  const location = useLocation();


  if (location.pathname === '/checkin') {
    return <Navigate to="/checkin/appointments" replace />;
  }

  return (
    <div className='flex flex-col'>
      
     <div className={`absolute hidden sm:block -z-10`}>
      <style>
    {`
      @keyframes pulse-slow {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 0.9; }
      }
      .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      .delay-200 { animation-delay: 0.2s; }
      .delay-400 { animation-delay: 0.4s; }
      .delay-600 { animation-delay: 0.6s; }
    `}
  </style>
  
  <div className="relative top-30 sm:top-30 md:-left-30 sm:-left-50 w-80 h-80 bg-radial from-blue-600/50 to-blue-500/25 rounded-full blur-3xl animate-pulse-slow"></div>
  <div className="fixed md:-top-50 sm:-top-58 md:right-125 sm:right-52 sm:w-80 md:w-120 h-80 bg-radial from-red-600/75 to-red-600/50 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
  <div className="fixed -bottom-20 -right-40 w-80 h-80 bg-radial from-red-600/75 to-red-600/50 rounded-full blur-3xl animate-pulse-slow delay-400"></div>
  <div className="fixed -bottom-10 -left-10 w-40 h-40 bg-radial from-red-500/60 to-red-500/50 rounded-full blur-2xl animate-pulse-slow delay-600"></div>
</div>

      <div className="">
        <Stepper />
        <Outlet/>
      </div>
    </div>
  );
};

export default CheckIn;
