import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireUser({ children }) {
  const { isUser, loading } = useAuth()
  if (loading) return null
  return isUser ? children : <Navigate to="/login" replace />
}

export function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  return isAdmin ? children : <Navigate to="/" replace />
}