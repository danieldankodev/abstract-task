import { PrismaClient } from '@prisma/client';
import { Role } from "../src/user/user.interface";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    const role1 = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: Role.SUPER_ADMIN
        },
    });

    await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: {
            userName: 'superAdmin',
            roleId: role1.id,
            password: 'Pass123!'
        },
    });

    const role2 = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: Role.ADMIN
        },
    });

    await prisma.user.upsert({
        where: { id: 2 },
        update: {},
        create: {
            userName: 'admin',
            roleId: role2.id,
            password: 'Pass123!'
        },
    });

    const role3 = await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: {
            name: Role.BASIC
        },
    });

    await prisma.user.upsert({
        where: { id: 3 },
        update: {},
        create: {
            userName: 'basic',
            roleId: role3.id,
            password: 'Pass123!'
        },
    });

    console.log({ role1, role2, role3 });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
