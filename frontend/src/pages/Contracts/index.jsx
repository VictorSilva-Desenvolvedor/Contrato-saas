import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { Plus,  Send, X } from 'lucide-react'
import ContractModal from './ContractModal'
import SignatureModal from './SignatureModal'

const statusColor = {
  draft:              'bg-gray-100 text-gray-600',
  pending_signature:  'bg-yellow-100 text-yellow-700',
  signed:             'bg-green-100 text-green-700',
}
const statusLabel = {
  draft:              'Rascunho',
  pending_signature:  'Aguard. assinatura',
  signed:             'Assinado',
}

export default function Contracts() {
  const [contracts, setContracts]       = useState([])
  const [showModal, setShowModal]       = useState(false)
  const [showSigModal, setShowSigModal] = useState(null)

  const load = () => api.get('/contracts').then(r => setContracts(r.data))

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!confirm('Excluir contrato?')) return
    await api.delete(`/contracts/${id}`)
    toast.success('Removido')
    load()
  }

  const daysLeft = (end) => {
    const diff = new Date(end) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          <Plus size={16} /> Novo Contrato
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Parte', 'Tipo', 'Valor', 'Início', 'Encerramento', 'Vigência', 'Status', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.partyName}</td>
                <td className="px-4 py-3 text-gray-500">{c.type}</td>
                <td className="px-4 py-3">R$ {Number(c.value).toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3">{new Date(c.startDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3">{new Date(c.endDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <span className={daysLeft(c.endDate) < 30 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                    {daysLeft(c.endDate)} dias
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setShowSigModal(c.id)} title="Enviar para assinatura"
                    className="text-indigo-500 hover:text-indigo-700"><Send size={15} /></button>
                  <button onClick={() => remove(c.id)} title="Excluir"
                    className="text-red-400 hover:text-red-600"><X size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contracts.length === 0 && (
          <p className="text-center py-12 text-gray-400">Nenhum contrato encontrado</p>
        )}
      </div>

      {showModal && <ContractModal onClose={() => { setShowModal(false); load() }} />}
      {showSigModal && <SignatureModal contractId={showSigModal} onClose={() => setShowSigModal(null)} />}
    </div>
  )
}