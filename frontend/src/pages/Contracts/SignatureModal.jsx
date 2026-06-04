import { useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function SignatureModal({ contractId, onClose }) {
  const [form, setForm] = useState({ channel: 'email', sentTo: '' })
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    try {
      await api.post('/signatures', { contractId, ...form })
      toast.success('Enviado para assinatura!')
      onClose()
    } catch  {
      toast.error('Erro ao enviar')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-bold mb-4">Enviar para Assinatura</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Canal</label>
            <select name="channel" value={form.channel} onChange={handle}
              className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="email">E-mail</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="both">Ambos</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              {form.channel === 'whatsapp' ? 'Número WhatsApp' : 'E-mail'}
            </label>
            <input name="sentTo" value={form.sentTo} onChange={handle}
              placeholder={form.channel === 'whatsapp' ? '5511999999999' : 'email@exemplo.com'}
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
          <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Enviar</button>
        </div>
      </div>
    </div>
  )
}