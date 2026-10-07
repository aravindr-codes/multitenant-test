import { useMsal } from '@azure/msal-react'

export default function UnknownTenantPage() {
  const { instance, accounts } = useMsal()
  const user = accounts[0]

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/login' })
  }

  return (
    <div className="page center">
      <div className="card tenant-unknown">
        <span className="badge error">Unknown Tenant</span>
        <h1>Access Restricted</h1>
        <p>
          Your organisation (<strong>{user?.tenantId}</strong>) is not registered
          with this application.
        </p>
        <p className="muted">Please contact your administrator.</p>
        <button className="btn-secondary" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}
