import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ObraModal({ onClose }) {
  const [contracts, setContracts] = useState([])
  const [form, setForm] = useState({
    name: '', address: '', budget: '', startDate: '', status: 'planejamento', contractId: ''
  })

  useEffect(() => {
    api.get('/contracts?status=signed').then(r => setContracts(r.data))
  }, [])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const inp = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-400"

  const submit = async () => {
    try {
      await api.post('/obras', {
        ...form,
        budget: parseFloat(form.budget),
        contractId: form.contractId || undefined
      })
      toast.success('Obra criada com roteiro padrão!')
      onClose()
    } catch {
      toast.error('Erro ao criar obra')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">Nova Obra</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Nome da Obra</label>
            <input name="name" onChange={handle} className={inp} />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Endereço</label>
            <input name="address" onChange={handle} className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Orçamento (R$)</label>
            <input name="budget" type="number" onChange={handle} className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Início</label>
            <input name="startDate" type="date" onChange={handle} className={inp} />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Vincular a Contrato (opcional)</label>
            <select name="contractId" onChange={handle} className={inp}>
              <option value="">— Nenhum —</option>
              {contracts.map(c => (
                <option key={c.id} value={c.id}>{c.title} — {c.partyName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
          <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Criar</button>
        </div>
      </div>
    </div>
  )
}