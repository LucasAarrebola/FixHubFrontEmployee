import React, { useState, useEffect } from 'react'
import FormCard from '../components/FormCard'
import { Shield, Lock, AlertTriangle } from 'lucide-react'

export default function Security() {
  const [termsRead, setTermsRead] = useState(false)

  // Checa se o usuário já leu os termos
  useEffect(() => {
    const stored = localStorage.getItem('termsRead')
    if (stored === 'true') {
      setTermsRead(true)
    }
  }, [])

  // Função para marcar como lido
  const handleAccept = () => {
    localStorage.setItem('termsRead', 'true')
    setTermsRead(true)
  }

  // Função para reler os termos
  const handleReread = () => {
    localStorage.removeItem('termsRead')
    setTermsRead(false)
  }

  return (
    <div className="py-6">
      <FormCard title="Segurança e Privacidade">
        {/* Seção 1 - Proteção */}
        <div className="flex items-center gap-3 mb-3">
          <Shield className="text-sky-700" />
          <h2 className="text-xl font-semibold text-gray-700">Proteção da sua conta</h2>
        </div>
        <p className="text-gray-600 mb-5 leading-relaxed">
          No FixHub, a segurança dos seus dados é uma prioridade. 
          Adotamos medidas para garantir que suas informações e atividades 
          sejam protegidas contra acessos não autorizados.
        </p>

        {/* Seção 2 - Boas práticas */}
        <div className="flex items-center gap-3 mb-3">
          <Lock className="text-sky-700" />
          <h2 className="text-xl font-semibold text-gray-700">Boas práticas de segurança</h2>
        </div>
        <ul className="list-disc pl-6 text-gray-600 mb-5 space-y-1">
          <li>Evite compartilhar suas credenciais de acesso.</li>
          <li>Não acesse o sistema em dispositivos públicos ou desconhecidos.</li>
          <li>Mantenha seu navegador e sistema operacional atualizados.</li>
          <li>Desconfie de links e mensagens fora do ambiente oficial do FixHub.</li>
        </ul>

        {/* Seção 3 - Política de dados */}
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="text-sky-700" />
          <h2 className="text-xl font-semibold text-gray-700">Política de dados e privacidade</h2>
        </div>
        <p className="text-gray-600 mb-5 leading-relaxed">
          As informações coletadas no FixHub são utilizadas exclusivamente 
          para o funcionamento do sistema e melhoria da experiência do usuário. 
          Nenhum dado é compartilhado com terceiros sem autorização prévia.
        </p>
        <p className="text-gray-600 mb-5 leading-relaxed">
          Mesmo que o usuário opte por excluir sua conta, os dados relacionados 
          aos tickets criados permanecerão armazenados e poderão continuar sendo 
          utilizados para fins de histórico, auditoria e melhoria dos serviços.
        </p>

        {/* Seção 4 - Termos de uso */}
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Termos de uso</h2>
        <p className="text-gray-600 leading-relaxed mb-5">
          Ao utilizar o FixHub, você concorda em seguir as diretrizes de uso responsável, 
          respeitando os demais usuários e mantendo informações verdadeiras. 
          O descumprimento dos termos pode resultar na suspensão do acesso.
        </p>

        {/* Botões de ação */}
        <div className="flex justify-end items-center gap-3 mt-6">
          {!termsRead ? (
            <button
              onClick={handleAccept}
              className="btn-primary"
            >
              Li e concordo
            </button>
          ) : (
            <>
              <span className="text-green-600 font-medium">
                ✅ Você já leu e aceitou os termos.
              </span>
              <button
                onClick={handleReread}
                className="px-3 py-2 rounded-lg border border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition"
              >
                Quero reler os termos
              </button>
            </>
          )}
        </div>
      </FormCard>
    </div>
  )
}
