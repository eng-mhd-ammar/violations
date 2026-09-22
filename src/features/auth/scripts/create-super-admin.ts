import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import { db } from '../../../prisma/db';


async function main() {
  const username = process.argv[2];
  const phone = process.argv[3];
  const password = process.argv[4];
  const firstName = process.argv[5];
  const lastName = process.argv[6];

  if (
    !username ||
    !phone ||
    !password ||
    !firstName ||
    !lastName
  ) {
    console.error(
      'Usage: npm run create:super-admin -- <username> <phone> <password> <firstName> <lastName>',
    );

    process.exit(1);
  }

  await db.connect();

  // Find the super_admin role first
  let role = await db.orm.public.Role
    .where((role) =>
      role.slug.eq('super_admin'),
    )
    .first();

  // Create role if it doesn't exist
  if (!role) {
    role = await db.orm.public.Role.create({
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'System Super Administrator',
      isActive: true,
    });
  }

  // Check if a Super Admin already exists
  const existingSuperAdmin =
    await db.orm.public.UserRole
      .where((userRole) =>
        userRole.roleId.eq(role.id),
      )
      .first();

  if (existingSuperAdmin) {
    throw new Error(
      'A Super Admin already exists.',
    );
  }

  // Check username
  const existingUsername =
    await db.orm.public.User
      .where((user) =>
        user.username.eq(username),
      )
      .first();

  if (existingUsername) {
    throw new Error(
      `Username "${username}" already exists.`,
    );
  }

  // Check phone
  const existingPhone =
    await db.orm.public.User
      .where((user) =>
        user.phone.eq(phone),
      )
      .first();

  if (existingPhone) {
    throw new Error(
      `Phone "${phone}" already exists.`,
    );
  }

  // Hash password
  const hashedPassword =
    await bcrypt.hash(password, 12);

  // Create user
  const user =
    await db.orm.public.User.create({
      username,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      isActive: true,
    });

  // Attach Super Admin role
  await db.orm.public.UserRole.create({
    userId: user.id,
    roleId: role.id,
  });

  console.log(
    '\nSuper Admin created successfully!\n',
  );

  console.log({
    id: user.id,
    username: user.username,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
    role: role.slug,
  });
}

main().catch((error) => {
  console.error(
    '\nFailed to create Super Admin:\n',
    error,
  );

  process.exit(1);
});