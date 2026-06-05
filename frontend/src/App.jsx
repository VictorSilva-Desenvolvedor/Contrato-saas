import { Routes, Route, Navigate } from 'react-router-dom'
import Layout        from './components/layout/Layout'
import Dashboard     from './pages/Dashboard'
import Contracts     from './pages/Contracts/index'
import ContractManager from './pages/ContractManager/index'
import Templates     from './pages/Templates/index'
import Obras         from './pages/Obras/index'
import Signatures    from './pages/Signatures/index'
import Reports       from './pages/Reports/index'
import Users         from './pages/Users/index'
import Login         from './pages/Login'
import PublicSign    from './pages/PublicSign'
import useAuthStore  from './store/authStore'

function App() {
  const token = useAuthStore(s => s.token)

  return (
    <Routes>
      {/* Rota pública — sem auth */}
      <Route path="/assinar/:token" element={<PublicSign />} />

      {!token ? (
        <Route path="*" element={<Login />} />
      ) : (
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/"            element={<Dashboard />} />
              <Route path="/contratos"   element={<Contracts />} />
              <Route path="/gerenciador" element={<ContractManager />} />
              <Route path="/templates"   element={<Templates />} />
              <Route path="/assinaturas" element={<Signatures />} />
              <Route path="/obras"       element={<Obras />} />
              <Route path="/relatorios"  element={<Reports />} />
              <Route path="/usuarios"    element={<Users />} />
              <Route path="*"            element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        } />
      )}
    </Routes>
  )
}

export default App