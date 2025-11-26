import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaTicketAlt, 
  FaCog, 
  FaUser, 
  FaLock, 
  FaSignOutAlt, 
  FaQuestionCircle, 
  FaBus, 
  FaClipboardList, 
  FaCheckCircle 
} from 'react-icons/fa';

export default function SlideMenu({ open, onClose }) {
  return (
    <div aria-hidden={!open}>
      {open && <div className='fixed inset-0 z-40' onClick={onClose} />}
      <motion.aside
        initial={{ x: 300 }}
        animate={{ x: open ? 0 : 300 }}
        transition={{ type: 'spring' }}
        className='fixed right-0 top-0 z-50 h-full slide-menu bg-white shadow-lg p-6'
      >
        <button onClick={onClose} className='text-slate-500 mb-4'>
          FixHub
        </button>

        <nav className='flex flex-col gap-3 text-slate-700'>
          {/* Tickets pessoais */}
          <Link to="/reports" onClick={onClose} className="slide-item flex items-center gap-2">
            <FaTicketAlt className="w-4 h-4" /> Seus Tickets
          </Link>

          {/* Tickets atribuídos */}
          <Link to="/reports/assigned" onClick={onClose} className="slide-item flex items-center gap-2">
            <FaClipboardList className="w-4 h-4" /> Tickets Atribuídos
          </Link>

          {/* Tickets concluídos */}
          <Link to="/reports/resolved" onClick={onClose} className="slide-item flex items-center gap-2">
            <FaCheckCircle className="w-4 h-4" /> Tickets Concluídos
          </Link>

          {/* Configurações */}
          <Link to="/settings" onClick={onClose} className="slide-item flex items-center gap-2">
            <FaCog className="w-4 h-4" /> Configurações
          </Link>

          {/* Logout */}
          <Link to="/login" onClick={onClose} className='text-red-600 mt-4 slide-item flex items-center gap-2'>
            <FaSignOutAlt className="w-4 h-4" /> Sair
          </Link>
        </nav>
      </motion.aside>
    </div>
  )
}
