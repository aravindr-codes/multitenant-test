import { Routes, Route, Navigate } from 'react-router-dom'
import { MsalAuthenticationTemplate } from '@azure/msal-react'
import { InteractionType } from '@azure/msal-browser'
import { loginRequest } from './authConfig'
import TenantRouter from './components/TenantRouter'
import TenantAPage from './pages/TenantAPage'
import TenantBPage from './pages/TenantBPage'
import UnknownTenantPage from './pages/UnknownTenantPage'
import LoginPage from './pages/LoginPage'

function ProtectedRoute({ children }) {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
    >
      {children}
    </MsalAuthenticationTemplate>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* After login, TenantRouter reads the tenant and redirects */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TenantRouter />
          </ProtectedRoute>
        }
      />

      {/* Tenant-specific destinations */}
      <Route
        path="/app-a"
        element={
          <ProtectedRoute>
            <TenantAPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app-b"
        element={
          <ProtectedRoute>
            <TenantBPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback for unmapped tenants */}
      <Route path="/unknown-tenant" element={<UnknownTenantPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
