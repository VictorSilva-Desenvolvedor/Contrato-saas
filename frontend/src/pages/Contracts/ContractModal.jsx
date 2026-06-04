import { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ContractModal({ onClose }) {
  const [templates, setTemplates] = useState([])
  const [form, setForm] = useState({
    title: '', partyName: '', partyDocument: '',
    type: 'serviço', value: '', startDate: '', endDate: '', content: ''
  })

  useEffect(() => {
    api.get('/templates').then(r => setTemplates(r.data))
  }, [])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const applyTemplate = (t) => {
    const tpl = templates.find(tp => tp.id === t)
    if (tpl) setForm(p => ({ ...p, content: tpl.content, type: tpl.category }))
  }

  const submit = async () => {
    try {
      await api.post('/contracts', { ...form, value: parseFloat(form.value) })
      toast.success('Contrato criado!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro')
    }
  }

  const inp = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-400"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg font-bold mb-4">Novo Contrato</h2>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Template (opcional)</label>
            <select onChange={e => applyTemplate(e.target.value)} className={inp}>
              <option value="">— Selecionar template —</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Título</label>
            <input name="title" value={form.title} onChange={handle} className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
            <select name="type" value={form.type} onChange={handle} className={inp}>
              {['serviço','obra','trabalho','locação','outro'].map(t =>
                <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Parte Relacionada</label>
            <input name="partyName" value={form.partyName} onChange={handle} className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">CPF / CNPJ</label>
            <input name="partyDocument" value={form.partyDocument} onChange={handle} className={inp} />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Valor (R$)</label>
            <input name="value" type="number" value={form.value} onChange={handle} className={inp} />
          </div>
          <div />

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Início</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handle} className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Encerramento</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handle} className={inp} />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Conteúdo do Contrato</label>
            <textarea name="content" value={form.content} onChange={handle} rows={8}
              className={inp + ' resize-none'} placeholder="Texto do contrato..." />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancelar</button>
          <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
        </div>
      </div>
    </div>
  )
}