/**
 * An array of routes that are accessible to the public
 * These route do not require authentication
 */
export const publicRoutes = [
    "/",
    "/auth/verify-email",
    "/api/register",
    "/api/login",
    "/api/verify-email"
]


/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset-password",
    "/api/reset-password",
    "/auth/new-password",
    "/api/new-password"
]

/**
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_DIRECT = "/dashboard"