import 'dotenv/config';

import { db } from '../../../../prisma/db';

const roles = [
    {
        name: 'مدير النظام',
        slug: 'admin',
        description: 'مدير النظام',
        isActive: true,
    },
    {
        name: 'ضابط الشرطة',
        slug: 'police_officer',
        description: 'ضابط شرطة المرور',
        isActive: true,
    },
    {
        name: 'المحاسب',
        slug: 'accountant',
        description: 'محاسب قسم المرور',
        isActive: true,
    },
];

const permissions = [
    // Addresses
    'address_create',
    'address_delete',
    'address_force_delete',
    'address_index',
    'address_restore',
    'address_show',
    'address_update',

    // Attachments
    'attachments_create',
    'attachments_delete',
    'attachments_force_delete',
    'attachments_index',
    'attachments_restore',
    'attachments_show',
    'attachments_update',

    // Branches
    'branch_create',
    'branch_delete',
    'branch_force_delete',
    'branch_index',
    'branch_restore',
    'branch_show',
    'branch_update',

    // Citizens
    'citizens_create',
    'citizens_delete',
    'citizens_force_delete',
    'citizens_index',
    'citizens_restore',
    'citizens_show',
    'citizens_update',

    // Currencies
    'currency_create',
    'currency_delete',
    'currency_force_delete',
    'currency_index',
    'currency_restore',
    'currency_show',
    'currency_update',

    // Objections
    'objections_create',
    'objections_delete',
    'objections_force_delete',
    'objections_index',
    'objections_restore',
    'objections_show',
    'objections_update',

    // Payments
    'payments_create',
    'payments_delete',
    'payments_force_delete',
    'payments_index',
    'payments_restore',
    'payments_show',
    'payments_update',

    // Permissions
    'permissions_create',
    'permissions_delete',
    'permissions_force_delete',
    'permissions_index',
    'permissions_restore',
    'permissions_show',
    'permissions_update',

    // Role Permissions
    'role_permissions_create',
    'role_permissions_delete',
    'role_permissions_force_delete',
    'role_permissions_index',
    'role_permissions_restore',
    'role_permissions_show',
    'role_permissions_update',

    // Roles
    'roles_create',
    'roles_delete',
    'roles_force_delete',
    'roles_index',
    'roles_restore',
    'roles_show',
    'roles_update',

    // States
    'states_create',
    'states_delete',
    'states_force_delete',
    'states_index',
    'states_restore',
    'states_show',
    'states_update',

    // User Roles
    'user_roles_create',
    'user_roles_delete',
    'user_roles_force_delete',
    'user_roles_index',
    'user_roles_restore',
    'user_roles_show',
    'user_roles_update',

    // Users
    'users_create',
    'users_delete',
    'users_force_delete',
    'users_index',
    'users_restore',
    'users_show',
    'users_update',

    // Violations
    'violations_create',
    'violations_delete',
    'violations_force_delete',
    'violations_index',
    'violations_restore',
    'violations_show',
    'violations_update',

    // Violation Types
    'violationType_create',
    'violationType_delete',
    'violationType_force_delete',
    'violationType_index',
    'violationType_restore',
    'violationType_show',
    'violationType_update',
];

const officerPermissions = [
    // Branches
    'branch_index',
    'branch_show',

    // Citizens
    'citizens_create',
    'citizens_index',
    'citizens_show',
    'citizens_update',

    // Addresses
    'address_create',
    'address_index',
    'address_show',
    'address_update',

    // Attachments
    'attachments_create',
    'attachments_index',
    'attachments_show',
    'attachments_update',

    // Objections
    'objections_create',
    'objections_index',
    'objections_show',
    'objections_update',

    // Violations
    'violations_create',
    'violations_index',
    'violations_show',
    'violations_update',

    // Violation Types
    'violationType_index',
    'violationType_show',
];

const accountantPermissions = [
    // Branches
    'branch_index',
    'branch_show',

    // Citizens
    'citizens_index',
    'citizens_show',

    // Addresses
    'address_index',
    'address_show',

    // Attachments
    'attachments_index',
    'attachments_show',

    // Violations
    'violations_index',
    'violations_show',

    // Violation Types
    'violationType_index',
    'violationType_show',

    // Payments
    'payments_create',
    'payments_index',
    'payments_show',
    'payments_update',

    // Objections
    'objections_index',
    'objections_show',

    // Currency
    'currency_index',
    'currency_show',
];

async function seedRoles(): Promise<void> {
    try {
        await db.connect();

        /* ---------------------------------------------------------
         * Create Roles
         * --------------------------------------------------------- */

        const roleRecords: Record<string, any> = {};

        for (const role of roles) {
            let existingRole = await db.orm.public.Role
                .where({
                    slug: role.slug,
                })
                .first();

            if (!existingRole) {
                existingRole = await db.orm.public.Role.create(role);
                console.log(`Role created: ${role.slug}`);
            } else {
                console.log(`Role already exists: ${role.slug}`);
            }

            roleRecords[role.slug] = existingRole;
        }

        /* ---------------------------------------------------------
         * Create Permissions
         * --------------------------------------------------------- */

        const permissionRecords: Record<string, any> = {};

        for (const permissionName of permissions) {
            let permission = await db.orm.public.Permission
                .where({
                    slug: permissionName,
                })
                .first();

            if (!permission) {
                permission = await db.orm.public.Permission.create({
                    name: permissionName,
                    slug: permissionName,
                    description: `${permissionName} permission`,
                });

                console.log(`Permission created: ${permissionName}`);
            } else {
                console.log(`Permission already exists: ${permissionName}`);
            }

            permissionRecords[permissionName] = permission;
        }

        /* ---------------------------------------------------------
         * Admin Permissions
         * --------------------------------------------------------- */

        const adminRole = roleRecords['admin'];

        for (const permissionName of permissions) {
            const permission = permissionRecords[permissionName];

            const existingRolePermission =
                await db.orm.public.RolePermission
                    .where({
                        roleId: adminRole.id,
                        permissionId: permission.id,
                    })
                    .first();

            if (!existingRolePermission) {
                await db.orm.public.RolePermission.create({
                    roleId: adminRole.id,
                    permissionId: permission.id,
                });

                console.log(
                    `Permission assigned to admin: ${permissionName}`,
                );
            }
        }

        /* ---------------------------------------------------------
         * Police Officer Permissions
         * --------------------------------------------------------- */

        const officerRole = roleRecords['police_officer'];

        for (const permissionName of officerPermissions) {
            const permission = permissionRecords[permissionName];

            const existingRolePermission =
                await db.orm.public.RolePermission
                    .where({
                        roleId: officerRole.id,
                        permissionId: permission.id,
                    })
                    .first();

            if (!existingRolePermission) {
                await db.orm.public.RolePermission.create({
                    roleId: officerRole.id,
                    permissionId: permission.id,
                });

                console.log(
                    `Permission assigned to police_officer: ${permissionName}`,
                );
            }
        }

        /* ---------------------------------------------------------
         * Accountant Permissions
         * --------------------------------------------------------- */

        const accountantRole = roleRecords['accountant'];

        for (const permissionName of accountantPermissions) {
            const permission = permissionRecords[permissionName];

            const existingRolePermission =
                await db.orm.public.RolePermission
                    .where({
                        roleId: accountantRole.id,
                        permissionId: permission.id,
                    })
                    .first();

            if (!existingRolePermission) {
                await db.orm.public.RolePermission.create({
                    roleId: accountantRole.id,
                    permissionId: permission.id,
                });

                console.log(
                    `Permission assigned to accountant: ${permissionName}`,
                );
            }
        }

        console.log('\nRoles and permissions seeding completed successfully.');
    } catch (error) {
        console.error('Failed to seed roles and permissions:', error);
        process.exitCode = 1;
    }
}

seedRoles();