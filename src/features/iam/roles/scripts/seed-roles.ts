import 'dotenv/config';
import { db } from '../../../../prisma/db';


const roles = [
    {
        name: 'admin',
        slug: 'admin',
        description: 'System administrator',
        isActive: true,
    },
    {
        name: 'officer',
        slug: 'police_officer',
        description: 'Traffic police officer',
        isActive: true,
    },
    {
        name: 'accountant',
        slug: 'accountant',
        description: 'Traffic department accountant',
        isActive: true,
    },
];

async function seedRoles(): Promise<void> {
    try {
        await db.connect();

        for (const role of roles) {
            const existingRole = await db.orm.public.Role.where({ slug: role.slug }).first();

            if (existingRole) {
                console.log(`Role already exists: ${role.slug}`);
                continue;
            }

            await db.orm.public.Role.create(role);

            console.log(`Role created: ${role.slug}`);
        }

        console.log('Roles seeding completed successfully.');
    } catch (error) {
        console.error('Failed to seed roles:', error);
        process.exitCode = 1;
    }
}

seedRoles();