import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import SlideMenu from './SlideMenu'
import Footer from './Footer'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Rotas onde o Navbar, SlideMenu e Footer não devem aparecer
  const noNavbarRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/forgot-password/reset'
  ]
  const hideNavbar = noNavbarRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar onMenu={() => setOpen(true)} />}
      {!hideNavbar && <SlideMenu open={open} onClose={() => setOpen(false)} />}

      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Outlet />
      </main>

      {!hideNavbar && <Footer />}
    </div>
  )
}
