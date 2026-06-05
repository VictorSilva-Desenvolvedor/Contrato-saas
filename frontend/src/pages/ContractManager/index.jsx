import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { AlertTriangle, RefreshCw, XCircle, FilePlus } from 'lucide-react'

const getVigenciaStatus = (endDate, status) => {
  if (status !== 'signed') return status
  const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0)  return 'encerrado'
  if (days <= 30) return 'vencendo'
  return 'ativo'
}

const statusStyle = {
  draft:             'bg-gray-100 text-gray-600',
  pending_signature: 'bg-yellow-100 text-yellow-700',
  ativo:             'bg-green-100 text-green-700',
  vencendo:          'bg-orange-100 text-orange-700',
  encerrado:         'bg-red-100 text-red-700',
}
const statusLabel = {
  draft:             'Rascunho',
  pending_signature: 'Aguard. Assinatura',
  ativo:             '✅ Ativo',
  vencendo:          '⚠️ Vencendo',
  encerrado:         '🔴 Encerrado',
}

export default function ContractManager() {
  const [contracts, setContracts] = useState([])
  const [search, setSearch]       = useState('')
  const [filterType, setFilter]   = useState('all')

  const load = () => api.get('/contracts').then(r => setContracts(r.data))
  useEffect(() => { load() }, [])

  const renew = async (c) => {
    const newEnd = new Date(c.endDate)
    newEnd.setFullYear(newEnd.getFullYear() + 1)
    await api.put(`/contracts/${c.id}`, {
      ...c,
      endDate: newEnd.toISOString(),
      status: 'draft'
    })
    toast.success('Contrato renovado (novo rascunho criado)')
    load()
  }

  const encerrar = async (id) => {
    if (!confirm('Encerrar este contrato?')) return
    await api.put(`/contracts/${id}`, { status: 'encerrado' })
    toast.success('Contrato encerrado')
    load()
  }

  const gerarAditivo = async (c) => {
    await api.post('/contracts', {
      title:         `Aditivo — ${c.title}`,
      partyName:     c.partyName,
      partyDocument: c.partyDocument,
      type:          c.type,
      value:         c.value,
      startDate:     new Date().toISOString(),
      endDate:       c.endDate,
      content:       `TERMO ADITIVO AO CONTRATO: ${c.title}\n\n[Descreva aqui as alterações...]\n\nContrato original: ${c.id}`,
      status:        'draft'
    })
    toast.success('Aditivo criado como rascunho!')
    load()
  }

  const daysLeft = (end) => Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24))

  const shown = contracts
    .filter(c => filterType === 'all' || getVigenciaStatus(c.endDate, c.status) === filterType)
    .filter(c => c.partyName.toLowerCase().includes(search.toLowerCase()) ||
                 c.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciador de Contratos</h1>

      {/* Alertas */}
      {contracts.filter(c => getVigenciaStatus(c.endDate, c.status) === 'vencendo').length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-orange-500" size={20} />
          <p className="text-orange-700 text-sm font-medium">
            {contracts.filter(c => getVigenciaStatus(c.endDate, c.status) === 'vencendo').length} contrato(s) vencendo nos próximos 30 dias!
          </p>
        </div>
      )}

      {/* Filtros + Busca */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por parte ou título..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-indigo-400" />
        <div className="flex gap-2">
          {['all','ativo','vencendo','encerrado','pending_signature'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition
                ${filterType === f ? 'bg-indigo-600 text-white' : 'border text-gray-600 hover:bg-gray-50'}`}>
              {f === 'all' ? 'Todos' : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Parte','Tipo','Valor','Início','Encerramento','Vigência','Status','Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(c => {
              const vigStatus = getVigenciaStatus(c.endDate, c.status)
              const days = daysLeft(c.endDate)
              return (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{c.partyName}</p>
                    <p className="text-xs text-gray-400">{c.partyDocument}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">{c.type}</td>
                  <td className="px-4 py-3 font-medium">R$ {Number(c.value).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3">{new Date(c.startDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">{new Date(c.endDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <span className={days < 0 ? 'text-red-500 font-bold' : days <= 30 ? 'text-orange-500 font-bold' : 'text-gray-600'}>
                      {days < 0 ? `${Math.abs(days)}d vencido` : `${days} dias`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[vigStatus] || statusStyle['draft']}`}>
                      {statusLabel[vigStatus] || vigStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => renew(c)} title="Renovar"
                        className="text-blue-500 hover:text-blue-700"><RefreshCw size={15} /></button>
                      <button onClick={() => gerarAditivo(c)} title="Gerar Aditivo"
                        className="text-purple-500 hover:text-purple-700"><FilePlus size={15} /></button>
                      <button onClick={() => encerrar(c.id)} title="Encerrar"
                        className="text-red-400 hover:text-red-600"><XCircle size={15} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {shown.length === 0 && <p className="text-center py-12 text-gray-400">Nenhum contrato</p>}
      </div>
    </div>
  )
}