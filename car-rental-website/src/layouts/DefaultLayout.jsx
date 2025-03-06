import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'   
import Footer from '../components/Footer/Footer'


export default function DefaultLayout() {
  return (
    <>
        <Navbar />
        <main>
        <Outlet />    
        </main>
        <Footer />
    </>
  )
}
