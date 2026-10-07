import { useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { TENANT_A_ID, TENANT_B_ID, APP_B_URL } from '../authConfig'

/**
 * Runs after a successful login.
 * - Tenant A users: render children (the App A dashboard).
 * - Tenant B users: hard-redirect to App B.
 * - Anyone else: show an access-denied message.
 */
export default function TenantGate({ children }) {
  const { accounts } = useMsal()
  const account = accounts[0]
  const tenantId = account?.tenantId

  useEffect(() => {
    if (tenantId === TENANT_B_ID) {
      window.location.href = APP_B_URL
    }
  }, [tenantId])

  if (!tenantId) return null

  if (tenantId === TENANT_B_ID) {
    return (
      <div className="page center">
        <div className="card">
          <p>Redirecting you to App B…</p>
        </div>
      </div>
    )
  }

  if (tenantId === TENANT_A_ID) {
    return children
  }

  return (
    <div className="page center">
      <div className="card">
        <span className="badge error">Access Denied</span>
        <h1>Unknown Organisation</h1>
        <p>Your tenant (<strong>{tenantId}</strong>) is not registered with this application.</p>
      </div>
    </div>
  )
}
