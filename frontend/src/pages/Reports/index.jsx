import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6']

export default function Reports() {
  const [tab, setTab]                 = useState('contracts')
  const [contractsData, setContracts] = useState(null)
  const [obrasData, setObras]         = useState(null)
  const [sigData, setSig]             = useState(null)

  useEffect(() => {
    api.get('/reports/contracts').then(r => setContracts(r.data))
    api.get('/reports/obras').then(r => setObras(r.data))
    api.get('/reports/signatures').then(r => setSig(r.data))
  }, [])

  const tabs = ['contracts','obras','signatures']
  const tabLabel = { contracts: 'Contratos', obras: 'Obras', signatures: 'Assinaturas' }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Relatórios</h1>

      <div className="flex gap-2 mb-6 border-b">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition
              ${tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            {tabLabel[t]}
          </button>
        ))}
      </div>

      {/* CONTRATOS */}
      {tab === 'contracts' && contractsData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total',        value: contractsData.summary.total },
              { label: 'Valor Total',  value: `R$ ${contractsData.summary.totalValue.toLocaleString('pt-BR')}` },
              { label: 'Assinados',    value: contractsData.summary.byStatus.signed },
              { label: 'Rascunhos',    value: contractsData.summary.byStatus.draft },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 border shadow-sm text-center">
                <p className="text-2xl font-bold text-indigo-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Contratos por Tipo</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Object.entries(contractsData.summary.byType).map(([name, count]) => ({ name, count }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Título','Parte','Tipo','Valor','Status'].map(h =>
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {contractsData.contracts.map(c => (
                  <tr key={c.id} className="border-b">
                    <td className="px-4 py-2">{c.title}</td>
                    <td className="px-4 py-2 text-gray-500">{c.partyName}</td>
                    <td className="px-4 py-2 capitalize">{c.type}</td>
                    <td className="px-4 py-2">R$ {Number(c.value).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-2">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OBRAS */}
      {tab === 'obras' && obrasData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Obras',    value: obrasData.summary.total },
              { label: 'Orçamento Total',value: `R$ ${obrasData.summary.totalBudget.toLocaleString('pt-BR')}` },
              { label: 'Total Gasto',    value: `R$ ${obrasData.summary.totalGasto.toLocaleString('pt-BR')}` },
              { label: 'Acima do Budget',value: obrasData.summary.overBudget },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 border shadow-sm text-center">
                <p className="text-2xl font-bold text-indigo-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">Orçado vs Realizado por Obra</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={obrasData.obras}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={v => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
                <Bar dataKey="budget"    name="Orçado"    fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="realizado" name="Realizado" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ASSINATURAS */}
      {tab === 'signatures' && sigData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total',     value: sigData.summary.total },
              { label: 'Assinados', value: sigData.summary.signed },
              { label: 'Pendentes', value: sigData.summary.pending },
              { label: 'Expirados', value: sigData.summary.expired },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 border shadow-sm text-center">
                <p className="text-2xl font-bold text-indigo-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 border shadow-sm flex justify-center">
            <PieChart width={300} height={280}>
              <Pie data={[
                { name: 'Assinados', value: sigData.summary.signed },
                { name: 'Pendentes', value: sigData.summary.pending },
                { name: 'Expirados', value: sigData.summary.expired },
              ]} cx={150} cy={140} outerRadius={110} dataKey="value" label>
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}
    </div>
  )
}