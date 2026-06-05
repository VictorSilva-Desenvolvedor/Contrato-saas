import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Clock, CheckCircle, XCircle, Mail, MessageCircle } from 'lucide-react'

const statusIcon = {
  pending: <Clock size={16} className="text-yellow-500" />,
  signed:  <CheckCircle size={16} className="text-green-500" />,
  expired: <XCircle size={16} className="text-red-500" />
}
const statusLabel = { pending: 'Aguardando', signed: 'Assinado', expired: 'Expirado' }
const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  signed:  'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700'
}
const channelIcon = {
  email:    <Mail size={14} />,
  whatsapp: <MessageCircle size={14} />,
  both:     <span className="text-xs">📧+💬</span>
}

export default function Signatures() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    api.get('/signatures').then(r => setRequests(r.data))
  }, [])

  const expire = async () => {
    await api.post('/signatures/expire')
    api.get('/signatures').then(r => setRequests(r.data))
  }

  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assinaturas</h1>
        <button onClick={expire}
          className="text-sm border px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
          Expirar pendentes antigas
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {['all','pending','signed','expired'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${filter === f ? 'bg-indigo-600 text-white' : 'border text-gray-600 hover:bg-gray-50'}`}>
            {f === 'all' ? 'Todos' : statusLabel[f]}
            <span className="ml-2 text-xs opacity-70">
              ({requests.filter(r => f === 'all' || r.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>{channelIcon[r.channel]}</div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{r.contract?.title}</p>
                  <p className="text-xs text-gray-500">{r.sentTo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>
                  {statusIcon[r.status]} {statusLabel[r.status]}
                </span>
              </div>
            </div>
            <div className="flex gap-6 mt-3 text-xs text-gray-400">
              <span>Enviado: {new Date(r.sentAt).toLocaleString('pt-BR')}</span>
              {r.signedAt && <span>Assinado: {new Date(r.signedAt).toLocaleString('pt-BR')}</span>}
              <span className="ml-auto">
                Link: <a href={`http://localhost:5173/assinar/${r.token}`}
                  target="_blank" rel="noreferrer"
                  className="text-indigo-500 underline">Abrir</a>
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 text-gray-400">Nenhuma assinatura encontrada</p>
        )}
      </div>
    </div>
  )
}