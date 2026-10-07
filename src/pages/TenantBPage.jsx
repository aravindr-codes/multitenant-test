import { useMsal } from '@azure/msal-react'

export default function TenantBPage() {
  const { instance, accounts } = useMsal()
  const user = accounts[0]

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/login' })
  }

  return (
    <div className="page center">
      <div className="card tenant-b">
        <span className="badge">Tenant B</span>
        <h1>Welcome to App B</h1>
        <p>Hello, <strong>{user?.name ?? user?.username}</strong></p>
        <p className="muted">{user?.username}</p>
        <p className="muted">Tenant: {user?.tenantId}</p>
        <hr />
        <p>This is the dedicated experience for Tenant B users.</p>
        <button className="btn-secondary" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}
