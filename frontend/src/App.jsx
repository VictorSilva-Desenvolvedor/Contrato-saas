import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts/index'
import Templates from './pages/Templates/index'
import Obras from './pages/Obras/index'
import Login from './pages/Login'
import useAuthStore from './store/authStore'

function App() {
  const token = useAuthStore(s => s.token)

  if (!token) return (
    <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  )

  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Dashboard />} />
        <Route path="/contratos" element={<Contracts />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/obras"     element={<Obras />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

export default App