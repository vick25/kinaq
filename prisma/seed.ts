import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        firstName: 'Alice',
        email: 'alice@prisma.io',
        password: 'password'
    },
    {
        firstName: 'Bob',
        email: 'bob@prisma.io',
        password: 'password'
    }
]

export async function main() {
    for (const u of userData) {
        await prisma.user.upsert({
            create: {
                firstName: u.firstName,
                email: u.email,
                password: u.password  // bcrypt hashed password
            },
            update: {},
            where: { email: u.email }
        })
    }
}

main()