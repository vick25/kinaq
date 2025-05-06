import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../app/generated/prisma/client';

// Define a more specific type for the global object.
// This helps with type safety and autocompletion.
declare global {
    // We need to use `var` here, not `let` or `const`, for global declarations.
    // eslint-disable-next-line no-unused-vars
    var __prisma: undefined | ReturnType<typeof createPrismaClientWithAccelerate>;
}

const createPrismaClientWithAccelerate = () => {
    console.log("Creating new PrismaClient with Accelerate instance"); // For debugging
    return new PrismaClient(
        // Optional: Add logging here if you suspect issues during instantiation
        // { log: ["query", "info", "warn", "error"] }
    ).$extends(withAccelerate(
        // Optional: Accelerate specific options if needed
        // { log: ["query", "info", "warn", "error"] }
    ));
}

// Use a unique global variable name to avoid potential conflicts
// with other libraries or parts of the Vercel environment.
const prisma = globalThis.__prisma ?? createPrismaClientWithAccelerate();

// In development, always reassign to globalThis.__prisma to benefit from HMR.
// In production, assign it only if it wasn't already there (first cold start).
// This ensures warm starts in production reuse the existing instance.
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
} else {
    if (!globalThis.__prisma) {
        globalThis.__prisma = prisma;
    }
}

export default prisma;