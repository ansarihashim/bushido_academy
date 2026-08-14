import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <span className="absolute inset-0 rounded-full border-4 border-neutral-800" />
          <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-500 animate-spin" />
        </div>
        <p className="mt-6 text-xs tracking-[0.3em] uppercase text-neutral-500 font-bold">
          Verifying Access
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
