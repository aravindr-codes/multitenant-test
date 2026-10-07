export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
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

export const TENANT_A_ID = import.meta.env.VITE_TENANT_A_ID
export const TENANT_B_ID = import.meta.env.VITE_TENANT_B_ID
export const APP_B_URL   = import.meta.env.VITE_APP_B_URL
