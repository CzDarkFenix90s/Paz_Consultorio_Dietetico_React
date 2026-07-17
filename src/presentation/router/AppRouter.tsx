// src/presentation/router/AppRouter.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import LandingPage from '../pages/public/LandingPage'
import PatientMenuPage from '../pages/patient/PatientMenuPage'
import PatientPlanPage from '../pages/patient/PatientPlanPage'
import PatientRecipesPage from '../pages/patient/PatientRecipesPage'
import PatientProgressPhotosPage from '../pages/patient/PatientProgressPhotosPage'
import PatientChatPage from '../pages/patient/PatientChatPage'
import PatientPlansListPage from '../pages/patient/PatientPlansListPage'
import PatientPlanDetailPage from '../pages/patient/PatientPlanDetailPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import PacienteFormPage from '../pages/admin/PacienteFormPage'
import PlanFormPage from '../pages/admin/PlanFormPage'

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user, loading, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-lg font-medium">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const userRole = user?.role?.toLowerCase()

  if (allowedRoles && userRole && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    // If not allowed, redirect to correct role portal
    if (userRole === 'admin' || userRole === 'nutricionista') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/patient/menu" replace />
    }
  }

  return <>{children}</>
}

// Guest Route Guard (Redirects if already logged in)
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    const userRole = user.role?.toLowerCase()
    if (userRole === 'admin' || userRole === 'nutricionista') {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/patient/menu" replace />
    }
  }

  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth (Redirect if logged in) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Patient Portal (Patient role only) */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/menu"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/plan"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/photos"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientProgressPhotosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/recipes"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/chat"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/plans"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientPlansListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/plans/:id"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PatientPlanDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin & Nutritionist Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'nutricionista']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pacientes/nuevo"
          element={
            <ProtectedRoute allowedRoles={['admin', 'nutricionista']}>
              <PacienteFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pacientes/editar/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'nutricionista']}>
              <PacienteFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/planes/nuevo"
          element={
            <ProtectedRoute allowedRoles={['admin', 'nutricionista']}>
              <PlanFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/planes/editar/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'nutricionista']}>
              <PlanFormPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
