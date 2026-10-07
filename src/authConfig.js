/**
 * Multi-tenant MSAL configuration.
 *
 * Replace the placeholder values with your actual Azure AD app registration details.
 * TENANT_A_ID and TENANT_B_ID are the Directory (tenant) IDs from Azure portal.
 */

export const msalConfig = {
  auth: {
    // Your app's Application (client) ID from Azure portal > App registrations
    clientId: import.meta.env.VITE_CLIENT_ID || 'YOUR_CLIENT_ID',

    // 'common' allows users from any Azure AD tenant or personal Microsoft accounts.
    // Use 'organizations' to restrict to work/school accounts only.
    authority: 'https://login.microsoftonline.com/common',

    // Must match a redirect URI registered in Azure portal
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
}

// Map tenant IDs to app routes. Add more tenants as needed.
export const tenantRouteMap = {
  [import.meta.env.VITE_TENANT_A_ID || 'TENANT_A_ID']: '/app-a',
  [import.meta.env.VITE_TENANT_B_ID || 'TENANT_B_ID']: '/app-b',
}

export const DEFAULT_ROUTE = '/unknown-tenant'
