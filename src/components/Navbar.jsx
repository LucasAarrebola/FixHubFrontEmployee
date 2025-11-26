//import React from 'react'
import { Link } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import logo from '/logo_fixhub.png' 

export default function Navbar({ onMenu }) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to="/home">
            <img
              src={logo}
              alt="Logo FixHub"
              className="w-10 h-10 object-contain rounded-lg"
            />
          </Link>

          <div>
            <Link to="/home" className="text-lg font-bold text-[var(--primary)]">
              FixHub
            </Link>
            <div className="text-xs text-slate-500">Sistema de manutenção</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-slate-600">
            Seus Tickets
          </Link>
          <Link
            to="/reports/create"
            className="btn-primary flex items-center justify-center text-center"
          >
            Abrir chamado
          </Link>
          <button
            className="p-2 rounded-md hover:bg-slate-100 flex items-center justify-center"
            onClick={onMenu}
          >
            <FiMenu size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
