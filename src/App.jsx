import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddWord from './pages/AddWord'
import Favorites from './pages/Favorites'
import Import from './pages/Import'
import Login from './pages/Login'
import EditWord from './pages/EditWord'
import { RequireUser, RequireAdmin } from './components/RequireAuth'


export default function App() {
  const { loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-stone-400 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />

          {/* User routes */}
          <Route path="/favorites" element={
            <RequireUser><Favorites /></RequireUser>
          } />

          {/* Admin routes */}
          <Route path="/add" element={
            <RequireAdmin><AddWord /></RequireAdmin>
          } />
          <Route path="/import" element={
            <RequireAdmin><Import /></RequireAdmin>
          } />
          <Route path="/edit/:id" element={
  <RequireAdmin><EditWord /></RequireAdmin>
} />
        </Routes>
      </main>
    </div>
  )
}