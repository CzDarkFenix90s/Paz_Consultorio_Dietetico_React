// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../pages/PlaceholderPage'
import AdminModelsPage from '../pages/admin/AdminModelsPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import PatientMenuPage from '../pages/patient/PatientMenuPage'
import PatientPlanPage from '../pages/patient/PatientPlanPage'
import PatientPlanDetailPage from '../pages/patient/PatientPlanDetailPage'
import PatientPlansListPage from '../pages/patient/PatientPlansListPage'
import PatientRecipesPage from '../pages/patient/PatientRecipesPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth — Módulo 3 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Catálogo (público) — Módulo 4 / 5 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/catalog" element={<PlaceholderPage title="Catálogo — Módulo 4" />} />
        <Route path="/products/:id" element={<PlaceholderPage title="Detalle de producto — Módulo 5" />} />

        {/* Requieren autenticación — Módulos 6, 7, 8 */}
        <Route path="/cart" element={<PlaceholderPage title="Carrito — Módulo 6" />} />
        <Route path="/orders" element={<PlaceholderPage title="Órdenes — Módulo 7" />} />
        <Route path="/orders/:id" element={<PlaceholderPage title="Detalle de orden — Módulo 7" />} />
        <Route path="/profile" element={<PlaceholderPage title="Perfil — Módulo 8" />} />
        <Route path="/patient" element={<PatientMenuPage />} />
        <Route path="/patient/menu" element={<PatientMenuPage />} />
        <Route path="/patient/plan" element={<PatientPlanPage />} />
        <Route path="/patient/plans" element={<PatientPlansListPage />} />
        <Route path="/patient/plans/:id" element={<PatientPlanDetailPage />} />
        <Route path="/patient/recipes" element={<PatientRecipesPage />} />

        {/* Admin — Módulos 9 a 13 */}
        <Route path="/admin" element={<AdminModelsPage />} />
        <Route path="/admin/models" element={<AdminModelsPage />} />
        <Route path="/admin/categories" element={<PlaceholderPage title="Admin Categorías — Módulo 10" />} />
        <Route path="/admin/products" element={<PlaceholderPage title="Admin Productos — Módulo 11" />} />
        <Route path="/admin/orders" element={<PlaceholderPage title="Admin Órdenes — Módulo 12" />} />
        <Route path="/admin/users" element={<PlaceholderPage title="Admin Usuarios — Módulo 13" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
