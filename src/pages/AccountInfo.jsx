import React, { useState, useEffect } from 'react'
import FormCard from '../components/FormCard'
import Swal from 'sweetalert2'

export default function AccountInfo() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    avatar: null
  })
  const [preview, setPreview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState('')

  // Avatar com inicial azul e fundo branco (ou cinza claro se quiser)
  const gerarAvatarInicial = (nome) => {
    const letra = nome?.charAt(0)?.toUpperCase() || "?"

    return (
      <div
        className="
          w-28 h-28 rounded-full 
          bg-white 
          /* bg-slate-100  <-- use essa se quiser cinza claro */
          flex items-center justify-center 
          text-blue-600 
          text-4xl font-bold 
          shadow
        "
      >
        {letra}
      </div>
    )
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          Swal.fire('Erro', 'Usuário não autenticado. Faça login novamente.', 'error')
          return
        }

        const response = await fetch('https://projeto-integrador-fixhub.onrender.com/api/fixhub/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Erro ao buscar dados do usuário')

        const data = await response.json()

        setForm({
          nome: data.pessoa?.nome || '',
          email: data.email || '',
          telefone: data.pessoa?.telefone || '',
          avatar: null
        })
        setPreview(null)
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        setMensagem('❌ Não foi possível carregar as informações do usuário.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setForm((prev) => ({ ...prev, avatar: file }))
    }
  }

  const handleSave = async () => {
    setMensagem('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        Swal.fire('Erro', 'Usuário não autenticado. Faça login novamente.', 'error')
        return
      }

      const response = await fetch('https://projeto-integrador-fixhub.onrender.com/api/fixhub/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone
        })
      })

      if (!response.ok) throw new Error('Erro ao salvar alterações')

      Swal.fire('Sucesso', 'Informações salvas com sucesso!', 'success')
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      Swal.fire('Erro', 'Não foi possível salvar as alterações.', 'error')
    }
  }

  const handleCancel = () => setIsEditing(false)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-slate-500 text-lg animate-pulse">Carregando informações...</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-10 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-xl font-semibold text-blue-600 mb-6">
          Informações da Conta
        </h2>

        {mensagem && (
          <div
            className={`text-base p-3 rounded-xl mb-6 font-medium ${
              mensagem.startsWith('❌')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {mensagem}
          </div>
        )}

        {!isEditing ? (
          <div className="flex flex-col items-center justify-center gap-4">

            {/* Avatar: se preview existir usa foto, senão usa inicial */}
            {preview ? (
              <img
                src={preview}
                className="w-28 h-28 rounded-full object-cover bg-blue-100 p-2 mb-2"
                alt="Avatar"
              />
            ) : (
              gerarAvatarInicial(form.nome)
            )}

            <div className="text-gray-800 font-bold text-2xl">{form.nome}</div>
            <div className="text-gray-500 text-lg">{form.email}</div>
            <div className="text-gray-500 text-lg">{form.telefone}</div>

            <button
              className="px-6 py-3 mt-6 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all shadow-md"
              onClick={() => setIsEditing(true)}
            >
              Editar informações
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-5 text-left">

            <div className="flex flex-col items-center">
              <label className="cursor-pointer flex flex-col items-center">

                {/* Avatar ou inicial */}
                {preview ? (
                  <img
                    src={preview}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
                    alt="Avatar do usuário"
                  />
                ) : (
                  gerarAvatarInicial(form.nome)
                )}

                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <div className="text-sm text-blue-600 mt-1">Alterar foto</div>
              </label>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium text-lg mb-1">Nome</span>
                <input
                  className="border rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-300 outline-none"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-gray-700 font-medium text-lg mb-1">E-mail</span>
                <input
                  className="border rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-300 outline-none"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Digite seu e-mail"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-gray-700 font-medium text-lg mb-1">Telefone</span>
                <input
                  className="border rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-300 outline-none"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(xx) xxxxx-xxxx"
                />
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-lg font-medium"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 text-lg shadow-md"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
