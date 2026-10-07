export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    // Scoped to Tenant B only — no cross-tenant sign-in needed here
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_B_ID}`,
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
