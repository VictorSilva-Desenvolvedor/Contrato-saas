import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function PublicSign() {
  const { token } = useParams()
  const [data, setData]     = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | signed | error

  useEffect(() => {
    api.get(`/public/contract/${token}`)
      .then(r => {
        setData(r.data)
        setStatus(r.data.status === 'signed' ? 'already_signed' : 'ready')
      })
      .catch(() => setStatus('error'))
  }, [token])

  const sign = async () => {
    try {
      await api.patch(`/public/sign/${token}`)
      setStatus('signed')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Carregando contrato...</p>
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl mb-2">❌</p>
        <p className="text-red-500 font-medium">Token inválido ou expirado</p>
      </div>
    </div>
  )

  if (status === 'signed' || status === 'already_signed') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-2xl shadow-md">
        <p className="text-4xl mb-3">✅</p>
        <h2 className="text-xl font-bold text-green-600 mb-1">Contrato Assinado!</h2>
        <p className="text-gray-500">Sua assinatura foi registrada com sucesso.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ContratoSaaS</h1>
              <p className="text-sm text-gray-500">Assinatura Eletrônica</p>
            </div>
          </div>

          {data && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{data.contract.title}</h2>
              <div className="flex gap-4 text-sm text-gray-500 mb-6">
                <span>Parte: <strong className="text-gray-700">{data.contract.partyName}</strong></span>
                <span>Valor: <strong className="text-gray-700">
                  R$ {Number(data.contract.value).toLocaleString('pt-BR')}
                </strong></span>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border mb-6 min-h-48 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {data.contract.content}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                <strong>⚠️ Atenção:</strong> Ao clicar em "Assinar Contrato" abaixo, você confirma
                que leu e concorda com todos os termos descritos neste documento. Esta assinatura
                tem validade jurídica conforme a Lei nº 14.063/2020.
              </div>

              <button onClick={sign}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition">
                ✍️ Assinar Contrato
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}