// testConnection.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Test the connection by fetching users
    const users = await prisma.user.findMany();
    console.log(users);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });