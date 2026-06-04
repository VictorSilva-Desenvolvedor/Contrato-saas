import { useEffect, useState } from 'react'
import api from '../../services/api'
// import toast from 'react-hot-toast'
import { Plus, ChevronRight } from 'lucide-react'
import ObraModal from './ObraModal'
import ObraDetail from './ObraDetail'

const statusColor = {
  planejamento: 'bg-blue-100 text-blue-700',
  execução:     'bg-yellow-100 text-yellow-700',
  entrega:      'bg-purple-100 text-purple-700',
  concluída:    'bg-green-100 text-green-700',
}

export default function Obras() {
  const [obras, setObras]     = useState([])
  const [showModal, setShow]  = useState(false)
  const [detail, setDetail]   = useState(null)

  const load = () => api.get('/obras').then(r => setObras(r.data))
  useEffect(() => { load() }, [])

  const totalRealizado = (obra) =>
    obra.custos?.reduce((s, c) => s + c.amount, 0) || 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Obras</h1>
        <button onClick={() => setShow(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          <Plus size={16} /> Nova Obra
        </button>
      </div>

      <div className="grid gap-4">
        {obras.map(o => {
          const realizado = totalRealizado(o)
          const pct = o.budget ? Math.min(100, Math.round(realizado / o.budget * 100)) : 0
          const steps = o.steps || []
          const done  = steps.filter(s => s.done).length

          return (
            <div key={o.id} className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{o.name}</h3>
                  <p className="text-sm text-gray-500">{o.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[o.status]}`}>
                    {o.status}
                  </span>
                  <button onClick={() => setDetail(o.id)}
                    className="text-indigo-500 hover:text-indigo-700">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-gray-400 text-xs">Orçamento</p>
                  <p className="font-medium">R$ {Number(o.budget).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Realizado</p>
                  <p className={`font-medium ${realizado > o.budget ? 'text-red-500' : 'text-green-600'}`}>
                    R$ {realizado.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Etapas</p>
                  <p className="font-medium">{done}/{steps.length} concluídas</p>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{pct}% do orçamento utilizado</p>
            </div>
          )
        })}
      </div>

      {showModal && <ObraModal onClose={() => { setShow(false); load() }} />}
      {detail && <ObraDetail obraId={detail} onClose={() => { setDetail(null); load() }} />}
    </div>
  )
}