import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { X, CheckCircle, Circle} from 'lucide-react'

export default function ObraDetail({ obraId, onClose }) {
  const [obra, setObra] = useState(null)
  const [tab, setTab]   = useState('roteiro')
  const [custo, setCusto] = useState({ category: 'material', description: '', amount: '', date: '' })
  const [oc, setOc]     = useState({ cnpjPagador: '', supplier: '', items: '', total: '' })

  const load = () => api.get(`/obras/${obraId}`).then(r => setObra(r.data))
  useEffect(() => { load() })

  if (!obra) return null

  const toggleStep = async (step) => {
    await api.patch(`/obras/${obraId}/steps/${step.id}`, { done: !step.done })
    load()
  }

  const addCusto = async () => {
    try {
      await api.post(`/obras/${obraId}/custos`, { ...custo, amount: parseFloat(custo.amount) })
      toast.success('Custo lançado')
      setCusto({ category: 'material', description: '', amount: '', date: '' })
      load()
    } catch { toast.error('Erro') }
  }

  const addOC = async () => {
    try {
      await api.post('/purchase-orders', {
        obraId,
        cnpjPagador: oc.cnpjPagador,
        supplier: oc.supplier,
        items: [{ description: oc.items }],
        total: parseFloat(oc.total)
      })
      toast.success('Ordem de Compra emitida!')
      setOc({ cnpjPagador: '', supplier: '', items: '', total: '' })
      load()
    } catch { toast.error('Erro') }
  }

  const phases = ['planejamento', 'execução', 'entrega']
  const inp = "w-full border rounded-lg px-3 py-2 text-sm"
  const tabs = ['roteiro', 'custos', 'ordens de compra', 'vistorias']

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold">{obra.name}</h2>
            <p className="text-sm text-gray-500">{obra.address}</p>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="flex border-b px-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition
                ${tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ROTEIRO */}
          {tab === 'roteiro' && (
            <div className="space-y-4">
              {phases.map(phase => (
                <div key={phase}>
                  <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">{phase}</h3>
                  <div className="space-y-2">
                    {(obra.steps || []).filter(s => s.phase === phase).map(step => (
                      <div key={step.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleStep(step)}>
                        {step.done
                          ? <CheckCircle size={18} className="text-green-500" />
                          : <Circle size={18} className="text-gray-300" />}
                        <span className={`text-sm ${step.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CUSTOS */}
          {tab === 'custos' && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <select value={custo.category} onChange={e => setCusto(p => ({ ...p, category: e.target.value }))} className={inp}>
                  {['material','mão de obra','equipamento','transporte','outros'].map(c =>
                    <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Descrição" value={custo.description}
                  onChange={e => setCusto(p => ({ ...p, description: e.target.value }))} className={inp} />
                <input type="number" placeholder="Valor (R$)" value={custo.amount}
                  onChange={e => setCusto(p => ({ ...p, amount: e.target.value }))} className={inp} />
                <input type="date" value={custo.date}
                  onChange={e => setCusto(p => ({ ...p, date: e.target.value }))} className={inp} />
                <button onClick={addCusto}
                  className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
                  Lançar Custo
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Categoria','Descrição','Valor','Data'].map(h =>
                      <th key={h} className="text-left px-3 py-2 text-gray-500 text-xs">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(obra.custos || []).map(c => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-2 capitalize">{c.category}</td>
                      <td className="px-3 py-2">{c.description}</td>
                      <td className="px-3 py-2">R$ {Number(c.amount).toLocaleString('pt-BR')}</td>
                      <td className="px-3 py-2">{new Date(c.date).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ORDENS DE COMPRA */}
          {tab === 'ordens de compra' && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input placeholder="CNPJ Pagador" value={oc.cnpjPagador}
                  onChange={e => setOc(p => ({ ...p, cnpjPagador: e.target.value }))} className={inp} />
                <input placeholder="Fornecedor" value={oc.supplier}
                  onChange={e => setOc(p => ({ ...p, supplier: e.target.value }))} className={inp} />
                <input placeholder="Itens / Descrição" value={oc.items}
                  onChange={e => setOc(p => ({ ...p, items: e.target.value }))} className={inp} />
                <input type="number" placeholder="Total (R$)" value={oc.total}
                  onChange={e => setOc(p => ({ ...p, total: e.target.value }))} className={inp} />
                <button onClick={addOC}
                  className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
                  Emitir Ordem de Compra
                </button>
              </div>
              {(obra.purchaseOrders || []).map(o => (
                <div key={o.id} className="border rounded-lg p-3 mb-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{o.supplier}</span>
                    <span className="text-green-600 font-medium">R$ {Number(o.total).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-gray-500 text-xs">CNPJ Pagador: {o.cnpjPagador}</p>
                </div>
              ))}
            </div>
          )}

          {/* VISTORIAS */}
          {tab === 'vistorias' && (
            <div>
              {(obra.vistorias || []).length === 0
                ? <p className="text-gray-400 text-sm">Nenhuma vistoria registrada.</p>
                : obra.vistorias.map(v => (
                    <div key={v.id} className="border rounded-lg p-4 mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${v.type === 'inicial' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        Vistoria {v.type}
                      </span>
                      <p className="text-sm text-gray-600 mt-2">{v.description}</p>
                    </div>
                  ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}