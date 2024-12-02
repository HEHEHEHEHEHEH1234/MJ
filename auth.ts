// Authentication configuration
export const AUTH_CONFIG = {
  // Test Google OAuth client ID that works in the WebContainer environment
  GOOGLE_CLIENT_ID: '1046265202045-h0bn5uo9n2p7bmskk6poi4hv9qesq0ni.apps.googleusercontent.com',
  // OAuth configuration
  GOOGLE_AUTH_OPTIONS: {
    flow: 'implicit',
    scope: 'email profile',
    ux_mode: 'popup',
    auto_select: false,
  }
};