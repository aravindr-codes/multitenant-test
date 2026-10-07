import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../authConfig'

export default function LoginPage() {
  const { instance } = useMsal()

  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
  }

  return (
    <div className="page center">
      <div className="card">
        <h1>Multi-Tenant App</h1>
        <p>Sign in with your Microsoft work or school account.</p>
        <button className="btn-primary" onClick={handleLogin}>
          Sign in with Microsoft
        </button>
      </div>
    </div>
  )
}
