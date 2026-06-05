import { useState } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function SignatureModal({ contractId, onClose }) {
  const [form, setForm] = useState({ channel: 'email', emailTo: '', whatsappTo: '' })
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateWhatsapp = (phone) => /^\d{10,15}$/.test(phone.replace(/\D/g, ''))

  const submit = async () => {
    try {
      const { channel, emailTo, whatsappTo } = form
      
      // Validações
      if (channel === 'email' && !emailTo) {
        return toast.error('Insira um e-mail válido')
      }
      if (channel === 'email' && !validateEmail(emailTo)) {
        return toast.error('E-mail inválido')
      }
      
      if (channel === 'whatsapp' && !whatsappTo) {
        return toast.error('Insira um número de WhatsApp')
      }
      if (channel === 'whatsapp' && !validateWhatsapp(whatsappTo)) {
        return toast.error('Número de WhatsApp inválido')
      }
      
      if (channel === 'both') {
        if (!emailTo || !validateEmail(emailTo)) {
          return toast.error('E-mail inválido')
        }
        if (!whatsappTo || !validateWhatsapp(whatsappTo)) {
          return toast.error('Número de WhatsApp inválido')
        }
      }

      await api.post('/signatures', { contractId, channel, emailTo, whatsappTo })
      toast.success('Enviado para assinatura!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar')
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
          
          {form.channel === 'email' && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">E-mail</label>
              <input name="emailTo" type="email" value={form.emailTo} onChange={handle}
                placeholder="email@exemplo.com"
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          )}
          
          {form.channel === 'whatsapp' && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Número WhatsApp</label>
              <input name="whatsappTo" value={form.whatsappTo} onChange={handle}
                placeholder="5511999999999"
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          )}
          
          {form.channel === 'both' && (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">E-mail</label>
                <input name="emailTo" type="email" value={form.emailTo} onChange={handle}
                  placeholder="email@exemplo.com"
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Número WhatsApp</label>
                <input name="whatsappTo" value={form.whatsappTo} onChange={handle}
                  placeholder="5511999999999"
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
          <button onClick={submit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Enviar</button>
        </div>
      </div>
    </div>
  )
}