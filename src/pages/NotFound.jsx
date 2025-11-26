import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="text-center py-12">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-2">Página não encontrada</p>
      <Link to="/" className="btn-primary mt-4 inline-block">Voltar ao início</Link>
    </div>
  )
}
