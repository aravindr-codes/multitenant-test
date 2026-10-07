import { MsalAuthenticationTemplate } from '@azure/msal-react'
import { InteractionType } from '@azure/msal-browser'
import { loginRequest } from './authConfig'
import TenantGate from './components/TenantGate'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginRequest}
    >
      <TenantGate>
        <DashboardPage />
      </TenantGate>
    </MsalAuthenticationTemplate>
  )
}
