import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    plugins: [
        emailOTPClient()
    ]
});