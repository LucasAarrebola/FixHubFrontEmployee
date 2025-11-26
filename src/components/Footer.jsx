import React from 'react'
export default function Footer(){
  return (
    <footer className="py-6 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} FixHub. Todos os direitos reservados.
    </footer>
  )
}
