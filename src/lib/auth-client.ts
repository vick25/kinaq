import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

export const authClient = createAuthClient({
    baseUrl: process.env.NODE_ENV === "development"
        ? new URL("http://localhost:3000")
        : new URL(`https://${process.env.BETTER_AUTH_URL!}`),
    plugins: [
        emailOTPClient()
    ]
});