import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, BookCopy, Building2,
  PenLine, BarChart3, Users, ClipboardList, LogOut
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const nav = [
  { section: 'Contratos & Assinaturas' },
  { to: '/',            label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/contratos',   label: 'Contratos',          icon: FileText },
  { to: '/gerenciador', label: 'Gerenciador',         icon: ClipboardList },
  { to: '/templates',   label: 'Templates',          icon: BookCopy },
  { to: '/assinaturas', label: 'Assinaturas',         icon: PenLine },
  { section: 'Obras & Configurações' },
  { to: '/obras',       label: 'Obras',              icon: Building2 },
  { to: '/relatorios',  label: 'Relatórios',         icon: BarChart3 },
  { to: '/usuarios',    label: 'Gestão de Usuários', icon: Users },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const logout = useAuthStore(s => s.logout)

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-90 bg-white border-r flex flex-col overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600">ContratoSaaS</h1>
          <p className="text-xs text-gray-400 mt-1">Gestão de Contratos & Obras</p>
        </div>

        <nav className="flex-1 p-4 space-y-0.5">
          {nav.map((item, i) =>
            item.section ? (
              <p key={i} className="text-xs font-semibold text-gray-400 uppercase px-3 pt-4 pb-1">
                {item.section}
              </p>
            ) : (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${pathname === item.to
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'}`}>
                <item.icon size={17} />
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button onClick={logout}
          className="flex items-center gap-3 px-7 py-4 text-sm text-gray-500 hover:text-red-500 border-t">
          <LogOut size={17} /> Sair
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}