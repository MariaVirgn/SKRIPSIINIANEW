import React from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
        <div className='bg-white min-h-screen flex flex-col'>    
            <Navbar />
            
            <main className="flex-grow">
                <Outlet/>
            </main>

            <Footer />
        </div>
  )
}

export default UserLayout