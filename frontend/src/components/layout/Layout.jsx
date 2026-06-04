import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, BookTemplate, Building2, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const nav = [
  { to: '/',          label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/contratos', label: 'Contratos',  icon: FileText },
  { to: '/templates', label: 'Templates',  icon: BookTemplate },
  { to: '/obras',     label: 'Obras',      icon: Building2 },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const logout = useAuthStore(s => s.logout)

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600">ContratoSaaS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${pathname === to ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <button onClick={logout}
          className="flex items-center gap-3 px-7 py-4 text-sm text-gray-500 hover:text-red-500 border-t">
          <LogOut size={18} /> Sair
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}