import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { tenantRouteMap, DEFAULT_ROUTE } from '../authConfig'

/**
 * Reads the tenant ID from the active MSAL account and redirects
 * to the route mapped for that tenant in authConfig.tenantRouteMap.
 */
export default function TenantRouter() {
  const { accounts } = useMsal()
  const navigate = useNavigate()

  useEffect(() => {
    if (accounts.length === 0) return

    const account = accounts[0]
    // tenantId is the Directory (tenant) ID of the logged-in user's home tenant
    const tenantId = account.tenantId

    const route = tenantRouteMap[tenantId] ?? DEFAULT_ROUTE
    navigate(route, { replace: true })
  }, [accounts, navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>Identifying your organisation…</p>
    </div>
  )
}
