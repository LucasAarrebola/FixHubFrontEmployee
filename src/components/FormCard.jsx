import React from 'react'
export default function FormCard({children, title}){
  return (
    <div className="app-screen">
      <div className="card">
        {title && <h3 className="text-xl font-bold text-[var(--primary)] mb-3">{title}</h3>}
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  )
}
