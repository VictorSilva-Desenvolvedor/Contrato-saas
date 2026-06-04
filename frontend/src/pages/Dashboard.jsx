import { useEffect, useState } from 'react'
import api from '../services/api'
import { FileText, Clock, AlertTriangle, Building2, TrendingUp, DollarSign } from 'lucide-react'

const Card = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
)

export default function Dashboard() {
  const [m, setM] = useState({})

  useEffect(() => {
    api.get('/dashboard/metrics').then(r => setM(r.data))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card icon={FileText}      label="Total de Contratos"     value={m.totalContracts  || 0} color="bg-indigo-500" />
        <Card icon={TrendingUp}    label="Contratos Ativos"       value={m.activeContracts || 0} color="bg-green-500"  />
        <Card icon={Clock}         label="Aguard. Assinatura"     value={m.pendingSignatures || 0} color="bg-yellow-500" />
        <Card icon={AlertTriangle} label="Vencendo em 30 dias"   value={m.expiringContracts || 0} color="bg-red-500"   />
        <Card icon={Building2}     label="Obras em Andamento"     value={m.obrasEmAndamento || 0} color="bg-blue-500"  />
        <Card icon={DollarSign}    label="Total Custos de Obras"  value={`R$ ${(m.totalCustos || 0).toLocaleString('pt-BR')}`} color="bg-purple-500" />
      </div>
    </div>
  )
}