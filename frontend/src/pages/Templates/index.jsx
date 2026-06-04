import { useEffect, useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['serviço','obra','trabalho','locação','outro']

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'serviço', content: '' })

  const load = () => api.get('/templates').then(r => setTemplates(r.data))
  useEffect(() => { load() }, [])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    try {
      await api.post('/templates', { ...form, fields: [] })
      toast.success('Template criado!')
      setShow(false)
      load()
    } catch {
      toast.error('Erro ao criar')
    }
  }

  const remove = async (id) => {
    await api.delete(`/templates/${id}`)
    toast.success('Removido')
    load()
  }

  const inp = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-400"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Templates</h1>
        <button onClick={() => setShow(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          <Plus size={16} /> Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white rounded-xl p-5 border shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{t.name}</h3>
                <span className="text-xs text-indigo-500 font-medium uppercase">{t.category}</span>
              </div>
              <button onClick={() => remove(t.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-sm text-gray-500 line-clamp-3">{t.content}</p>
          </div>
        ))}
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">Novo Template</h2>
            <div className="space-y-3">
              <input name="name" placeholder="Nome do template" onChange={handle} className={inp} />
              <select name="category" onChange={handle} className={inp}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea name="content" placeholder="Conteúdo padrão do contrato..." rows={8}
                onChange={handle} className={inp + ' resize-none'} />
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setShow(false)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
              <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}