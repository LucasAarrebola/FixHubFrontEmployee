import React from 'react'
import { Link } from 'react-router-dom'
export default function Settings(){
  const items = [
    {to:'/settings/account', label:'Informações da conta'},
    {to:'/settings/security', label:'Segurança'},
  ]
  return (
    <div className="app-screen">
      <div className="card">
        <h3 className="text-xl font-bold">Configurações da Conta</h3>
        <div className="mt-4 space-y-2">
          {items.map(i => <Link key={i.to} to={i.to} className="block p-3 border rounded-lg">{i.label}</Link>)}
        </div>
      </div>
    </div>
  )
}
