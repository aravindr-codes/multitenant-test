import { useMsal } from '@azure/msal-react'

export default function TenantAPage() {
  const { instance, accounts } = useMsal()
  const user = accounts[0]

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/login' })
  }

  return (
    <div className="page center">
      <div className="card tenant-a">
        <span className="badge">Tenant A</span>
        <h1>Welcome to App A</h1>
        <p>Hello, <strong>{user?.name ?? user?.username}</strong></p>
        <p className="muted">{user?.username}</p>
        <p className="muted">Tenant: {user?.tenantId}</p>
        <hr />
        <p>This is the dedicated experience for Tenant A users.</p>
        <button className="btn-secondary" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}
