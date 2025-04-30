import { Prisma } from '../src/app/generated/prisma/client'
import prisma from '@/lib/prisma'

const userData: Prisma.UserCreateInput[] = [
    {
        id: '1',
        firstName: 'Alice',
        email: 'alice@prisma.io',
        password: 'password'
    },
    {
        id: '2',
        firstName: 'Bob',
        email: 'bob@prisma.io',
        password: 'password'
    }
]

export async function main() {
    for (const u of userData) {
        await prisma.user.upsert({
            create: {
                id: u.id,
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