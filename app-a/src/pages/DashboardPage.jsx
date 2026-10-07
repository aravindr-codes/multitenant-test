import { useMsal } from '@azure/msal-react'

export default function DashboardPage() {
  const { instance, accounts } = useMsal()
  const user = accounts[0]

  const handleLogout = () => {
    instance.logoutRedirect()
  }

  return (
    <div className="page center">
      <div className="card tenant-a">
        <span className="badge">Tenant A — test-demo</span>
        <h1>Welcome to App A</h1>
        <p>Hello, <strong>{user?.name ?? user?.username}</strong></p>
        <p className="muted">{user?.username}</p>
        <hr />
        <p>You are signed in to the App A workspace.</p>
        <button className="btn-secondary" onClick={handleLogout}>Sign out</button>
      </div>
    </div>
  )
}
