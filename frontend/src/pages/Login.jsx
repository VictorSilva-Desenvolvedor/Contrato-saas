import { useState } from 'react'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({})
  const setAuth = useAuthStore(s => s.setAuth)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async () => {
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login'
      const { data } = await api.post(endpoint, form)
      setAuth(data.user, data.token)
      toast.success('Bem-vindo!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao entrar')
    }
  }

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
      <div className="bg-black p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-2">ContratoSaaS</h1>
        <p className="text-gray-500 mb-6">{isRegister ? 'Criar conta' : 'Entrar na plataforma'}</p>

        <div className="space-y-3">
          {isRegister && (
            <>
              <input name="companyName" placeholder="Nome da Empresa" onChange={handle}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-indigo-400" />
              <input name="cnpj" placeholder="CNPJ" onChange={handle}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-indigo-400" />
              <input name="name" placeholder="Seu nome" onChange={handle}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-indigo-400" />
            </>
          )}
          <input name="email" type="email" placeholder="E-mail" onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-indigo-400" />
          <input name="password" type="password" placeholder="Senha" onChange={handle}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-indigo-400" />
          <button onClick={submit}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            {isRegister ? 'Criar conta' : 'Entrar'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'}
          <button onClick={() => setIsRegister(p => !p)} className="text-indigo-500 ml-1 underline">
            {isRegister ? 'Entrar' : 'Cadastrar'}
          </button>
        </p>
      </div>
    </div>
  )
}