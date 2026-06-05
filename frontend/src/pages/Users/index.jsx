import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Trash2, Shield, User } from 'lucide-react'

export default function Users() {
  const [users, setUsers]   = useState([])
  const [logs, setLogs]     = useState([])
  const [tab, setTab]       = useState('users')
  const [show, setShow]     = useState(false)
  const [form, setForm]     = useState({ name:'', email:'', password:'', role:'user' })

  const load = () => {
    api.get('/users').then(r => setUsers(r.data))
    api.get('/users/audit-logs').then(r => setLogs(r.data))
  }
  useEffect(() => { load() }, [])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const inp = "w-full border rounded-lg px-3 py-2 text-sm"

  const submit = async () => {
    try {
      await api.post('/users', form)
      toast.success('Usuário criado!')
      setShow(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro')
    }
  }

  const remove = async (id) => {
    if (!confirm('Remover usuário?')) return
    await api.delete(`/users/${id}`)
    toast.success('Removido')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
        <button onClick={() => setShow(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="flex gap-2 border-b mb-6">
        {['users','logs'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition
              ${tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            {t === 'users' ? 'Usuários' : 'Audit Log'}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="grid gap-3">
          {users.map(u => (
            <div key={u.id} className="bg-white rounded-xl border p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${u.role === 'admin' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  {u.role === 'admin' ? <Shield size={18} className="text-indigo-600" /> : <User size={18} className="text-gray-500" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                  {u.role}
                </span>
                <button onClick={() => remove(u.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'logs' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Usuário','Ação','Entidade','ID','Data'].map(h =>
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-500">{l.userId.slice(0,8)}...</td>
                  <td className="px-4 py-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{l.action}</span>
                  </td>
                  <td className="px-4 py-2 capitalize text-gray-600">{l.entity}</td>
                  <td className="px-4 py-2 text-xs text-gray-400">{l.entityId.slice(0,8)}...</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{new Date(l.createdAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>
            <div className="space-y-3">
              <input name="name"     placeholder="Nome"  onChange={handle} className={inp} />
              <input name="email"    placeholder="Email" onChange={handle} className={inp} />
              <input name="password" type="password" placeholder="Senha" onChange={handle} className={inp} />
              <select name="role" onChange={handle} className={inp}>
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setShow(false)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
              <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}