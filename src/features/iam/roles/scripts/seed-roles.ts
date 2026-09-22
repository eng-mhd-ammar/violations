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
    {
        name: 'إنشاء عنوان',
        slug: 'address_create',
        description: 'السماح بإنشاء عنوان',
    },
    {
        name: 'حذف عنوان',
        slug: 'address_delete',
        description: 'السماح بحذف عنوان',
    },
    {
        name: 'حذف عنوان نهائياً',
        slug: 'address_force_delete',
        description: 'السماح بحذف عنوان نهائياً',
    },
    {
        name: 'عرض العناوين',
        slug: 'address_index',
        description: 'السماح بعرض قائمة العناوين',
    },
    {
        name: 'استعادة عنوان',
        slug: 'address_restore',
        description: 'السماح باستعادة عنوان محذوف',
    },
    {
        name: 'عرض عنوان',
        slug: 'address_show',
        description: 'السماح بعرض تفاصيل عنوان',
    },
    {
        name: 'تعديل عنوان',
        slug: 'address_update',
        description: 'السماح بتعديل بيانات عنوان',
    },

    // Attachments
    {
        name: 'إنشاء مرفق',
        slug: 'attachments_create',
        description: 'السماح بإنشاء مرفق',
    },
    {
        name: 'حذف مرفق',
        slug: 'attachments_delete',
        description: 'السماح بحذف مرفق',
    },
    {
        name: 'حذف مرفق نهائياً',
        slug: 'attachments_force_delete',
        description: 'السماح بحذف مرفق نهائياً',
    },
    {
        name: 'عرض المرفقات',
        slug: 'attachments_index',
        description: 'السماح بعرض قائمة المرفقات',
    },
    {
        name: 'استعادة مرفق',
        slug: 'attachments_restore',
        description: 'السماح باستعادة مرفق محذوف',
    },
    {
        name: 'عرض مرفق',
        slug: 'attachments_show',
        description: 'السماح بعرض تفاصيل مرفق',
    },
    {
        name: 'تعديل مرفق',
        slug: 'attachments_update',
        description: 'السماح بتعديل بيانات مرفق',
    },

    // Branches
    {
        name: 'إنشاء فرع',
        slug: 'branch_create',
        description: 'السماح بإنشاء فرع',
    },
    {
        name: 'حذف فرع',
        slug: 'branch_delete',
        description: 'السماح بحذف فرع',
    },
    {
        name: 'حذف فرع نهائياً',
        slug: 'branch_force_delete',
        description: 'السماح بحذف فرع نهائياً',
    },
    {
        name: 'عرض الفروع',
        slug: 'branch_index',
        description: 'السماح بعرض قائمة الفروع',
    },
    {
        name: 'استعادة فرع',
        slug: 'branch_restore',
        description: 'السماح باستعادة فرع محذوف',
    },
    {
        name: 'عرض فرع',
        slug: 'branch_show',
        description: 'السماح بعرض تفاصيل فرع',
    },
    {
        name: 'تعديل فرع',
        slug: 'branch_update',
        description: 'السماح بتعديل بيانات فرع',
    },

    // Citizens
    {
        name: 'إنشاء مواطن',
        slug: 'citizens_create',
        description: 'السماح بإنشاء مواطن',
    },
    {
        name: 'حذف مواطن',
        slug: 'citizens_delete',
        description: 'السماح بحذف مواطن',
    },
    {
        name: 'حذف مواطن نهائياً',
        slug: 'citizens_force_delete',
        description: 'السماح بحذف مواطن نهائياً',
    },
    {
        name: 'عرض المواطنين',
        slug: 'citizens_index',
        description: 'السماح بعرض قائمة المواطنين',
    },
    {
        name: 'استعادة مواطن',
        slug: 'citizens_restore',
        description: 'السماح باستعادة مواطن محذوف',
    },
    {
        name: 'عرض مواطن',
        slug: 'citizens_show',
        description: 'السماح بعرض تفاصيل مواطن',
    },
    {
        name: 'تعديل مواطن',
        slug: 'citizens_update',
        description: 'السماح بتعديل بيانات مواطن',
    },

    // Currencies
    {
        name: 'إنشاء عملة',
        slug: 'currency_create',
        description: 'السماح بإنشاء عملة',
    },
    {
        name: 'حذف عملة',
        slug: 'currency_delete',
        description: 'السماح بحذف عملة',
    },
    {
        name: 'حذف عملة نهائياً',
        slug: 'currency_force_delete',
        description: 'السماح بحذف عملة نهائياً',
    },
    {
        name: 'عرض العملات',
        slug: 'currency_index',
        description: 'السماح بعرض قائمة العملات',
    },
    {
        name: 'استعادة عملة',
        slug: 'currency_restore',
        description: 'السماح باستعادة عملة محذوفة',
    },
    {
        name: 'عرض عملة',
        slug: 'currency_show',
        description: 'السماح بعرض تفاصيل عملة',
    },
    {
        name: 'تعديل عملة',
        slug: 'currency_update',
        description: 'السماح بتعديل بيانات عملة',
    },

    // Objections
    {
        name: 'إنشاء اعتراض',
        slug: 'objections_create',
        description: 'السماح بإنشاء اعتراض',
    },
    {
        name: 'حذف اعتراض',
        slug: 'objections_delete',
        description: 'السماح بحذف اعتراض',
    },
    {
        name: 'حذف اعتراض نهائياً',
        slug: 'objections_force_delete',
        description: 'السماح بحذف اعتراض نهائياً',
    },
    {
        name: 'عرض الاعتراضات',
        slug: 'objections_index',
        description: 'السماح بعرض قائمة الاعتراضات',
    },
    {
        name: 'استعادة اعتراض',
        slug: 'objections_restore',
        description: 'السماح باستعادة اعتراض محذوف',
    },
    {
        name: 'عرض اعتراض',
        slug: 'objections_show',
        description: 'السماح بعرض تفاصيل اعتراض',
    },
    {
        name: 'تعديل اعتراض',
        slug: 'objections_update',
        description: 'السماح بتعديل بيانات اعتراض',
    },

    // Payments
    {
        name: 'إنشاء دفعة',
        slug: 'payments_create',
        description: 'السماح بإنشاء دفعة',
    },
    {
        name: 'حذف دفعة',
        slug: 'payments_delete',
        description: 'السماح بحذف دفعة',
    },
    {
        name: 'حذف دفعة نهائياً',
        slug: 'payments_force_delete',
        description: 'السماح بحذف دفعة نهائياً',
    },
    {
        name: 'عرض الدفعات',
        slug: 'payments_index',
        description: 'السماح بعرض قائمة الدفعات',
    },
    {
        name: 'استعادة دفعة',
        slug: 'payments_restore',
        description: 'السماح باستعادة دفعة محذوفة',
    },
    {
        name: 'عرض دفعة',
        slug: 'payments_show',
        description: 'السماح بعرض تفاصيل دفعة',
    },
    {
        name: 'تعديل دفعة',
        slug: 'payments_update',
        description: 'السماح بتعديل بيانات دفعة',
    },

    // Permissions
    {
        name: 'إنشاء صلاحية',
        slug: 'permissions_create',
        description: 'السماح بإنشاء صلاحية',
    },
    {
        name: 'حذف صلاحية',
        slug: 'permissions_delete',
        description: 'السماح بحذف صلاحية',
    },
    {
        name: 'حذف صلاحية نهائياً',
        slug: 'permissions_force_delete',
        description: 'السماح بحذف صلاحية نهائياً',
    },
    {
        name: 'عرض الصلاحيات',
        slug: 'permissions_index',
        description: 'السماح بعرض قائمة الصلاحيات',
    },
    {
        name: 'استعادة صلاحية',
        slug: 'permissions_restore',
        description: 'السماح باستعادة صلاحية محذوفة',
    },
    {
        name: 'عرض صلاحية',
        slug: 'permissions_show',
        description: 'السماح بعرض تفاصيل صلاحية',
    },
    {
        name: 'تعديل صلاحية',
        slug: 'permissions_update',
        description: 'السماح بتعديل بيانات صلاحية',
    },

    // Role Permissions
    {
        name: 'إنشاء صلاحية لدور',
        slug: 'role_permissions_create',
        description: 'السماح بإسناد صلاحية إلى دور',
    },
    {
        name: 'حذف صلاحية من دور',
        slug: 'role_permissions_delete',
        description: 'السماح بإزالة صلاحية من دور',
    },
    {
        name: 'حذف صلاحية الدور نهائياً',
        slug: 'role_permissions_force_delete',
        description: 'السماح بحذف صلاحية الدور نهائياً',
    },
    {
        name: 'عرض صلاحيات الأدوار',
        slug: 'role_permissions_index',
        description: 'السماح بعرض قائمة صلاحيات الأدوار',
    },
    {
        name: 'استعادة صلاحية الدور',
        slug: 'role_permissions_restore',
        description: 'السماح باستعادة صلاحية دور محذوفة',
    },
    {
        name: 'عرض صلاحية دور',
        slug: 'role_permissions_show',
        description: 'السماح بعرض تفاصيل صلاحية دور',
    },
    {
        name: 'تعديل صلاحية دور',
        slug: 'role_permissions_update',
        description: 'السماح بتعديل صلاحية دور',
    },

    // Roles
    {
        name: 'إنشاء دور',
        slug: 'roles_create',
        description: 'السماح بإنشاء دور',
    },
    {
        name: 'حذف دور',
        slug: 'roles_delete',
        description: 'السماح بحذف دور',
    },
    {
        name: 'حذف دور نهائياً',
        slug: 'roles_force_delete',
        description: 'السماح بحذف دور نهائياً',
    },
    {
        name: 'عرض الأدوار',
        slug: 'roles_index',
        description: 'السماح بعرض قائمة الأدوار',
    },
    {
        name: 'استعادة دور',
        slug: 'roles_restore',
        description: 'السماح باستعادة دور محذوف',
    },
    {
        name: 'عرض دور',
        slug: 'roles_show',
        description: 'السماح بعرض تفاصيل دور',
    },
    {
        name: 'تعديل دور',
        slug: 'roles_update',
        description: 'السماح بتعديل بيانات دور',
    },

    // States
    {
        name: 'إنشاء محافظة',
        slug: 'states_create',
        description: 'السماح بإنشاء محافظة',
    },
    {
        name: 'حذف محافظة',
        slug: 'states_delete',
        description: 'السماح بحذف محافظة',
    },
    {
        name: 'حذف محافظة نهائياً',
        slug: 'states_force_delete',
        description: 'السماح بحذف محافظة نهائياً',
    },
    {
        name: 'عرض المحافظات',
        slug: 'states_index',
        description: 'السماح بعرض قائمة المحافظات',
    },
    {
        name: 'استعادة محافظة',
        slug: 'states_restore',
        description: 'السماح باستعادة محافظة محذوفة',
    },
    {
        name: 'عرض محافظة',
        slug: 'states_show',
        description: 'السماح بعرض تفاصيل محافظة',
    },
    {
        name: 'تعديل محافظة',
        slug: 'states_update',
        description: 'السماح بتعديل بيانات محافظة',
    },

    // User Roles
    {
        name: 'إسناد دور لمستخدم',
        slug: 'user_roles_create',
        description: 'السماح بإسناد دور إلى مستخدم',
    },
    {
        name: 'حذف دور من مستخدم',
        slug: 'user_roles_delete',
        description: 'السماح بإزالة دور من مستخدم',
    },
    {
        name: 'حذف دور المستخدم نهائياً',
        slug: 'user_roles_force_delete',
        description: 'السماح بحذف دور المستخدم نهائياً',
    },
    {
        name: 'عرض أدوار المستخدمين',
        slug: 'user_roles_index',
        description: 'السماح بعرض قائمة أدوار المستخدمين',
    },
    {
        name: 'استعادة دور المستخدم',
        slug: 'user_roles_restore',
        description: 'السماح باستعادة دور مستخدم محذوف',
    },
    {
        name: 'عرض دور مستخدم',
        slug: 'user_roles_show',
        description: 'السماح بعرض تفاصيل دور مستخدم',
    },
    {
        name: 'تعديل دور مستخدم',
        slug: 'user_roles_update',
        description: 'السماح بتعديل دور مستخدم',
    },

    // Users
    {
        name: 'إنشاء مستخدم',
        slug: 'users_create',
        description: 'السماح بإنشاء مستخدم',
    },
    {
        name: 'حذف مستخدم',
        slug: 'users_delete',
        description: 'السماح بحذف مستخدم',
    },
    {
        name: 'حذف مستخدم نهائياً',
        slug: 'users_force_delete',
        description: 'السماح بحذف مستخدم نهائياً',
    },
    {
        name: 'عرض المستخدمين',
        slug: 'users_index',
        description: 'السماح بعرض قائمة المستخدمين',
    },
    {
        name: 'استعادة مستخدم',
        slug: 'users_restore',
        description: 'السماح باستعادة مستخدم محذوف',
    },
    {
        name: 'عرض مستخدم',
        slug: 'users_show',
        description: 'السماح بعرض تفاصيل مستخدم',
    },
    {
        name: 'تعديل مستخدم',
        slug: 'users_update',
        description: 'السماح بتعديل بيانات مستخدم',
    },

    // Violations
    {
        name: 'إنشاء مخالفة',
        slug: 'violations_create',
        description: 'السماح بإنشاء مخالفة',
    },
    {
        name: 'حذف مخالفة',
        slug: 'violations_delete',
        description: 'السماح بحذف مخالفة',
    },
    {
        name: 'حذف مخالفة نهائياً',
        slug: 'violations_force_delete',
        description: 'السماح بحذف مخالفة نهائياً',
    },
    {
        name: 'عرض المخالفات',
        slug: 'violations_index',
        description: 'السماح بعرض قائمة المخالفات',
    },
    {
        name: 'استعادة مخالفة',
        slug: 'violations_restore',
        description: 'السماح باستعادة مخالفة محذوفة',
    },
    {
        name: 'عرض مخالفة',
        slug: 'violations_show',
        description: 'السماح بعرض تفاصيل مخالفة',
    },
    {
        name: 'تعديل مخالفة',
        slug: 'violations_update',
        description: 'السماح بتعديل بيانات مخالفة',
    },

    // Violation Types
    {
        name: 'إنشاء نوع مخالفة',
        slug: 'violationType_create',
        description: 'السماح بإنشاء نوع مخالفة',
    },
    {
        name: 'حذف نوع مخالفة',
        slug: 'violationType_delete',
        description: 'السماح بحذف نوع مخالفة',
    },
    {
        name: 'حذف نوع مخالفة نهائياً',
        slug: 'violationType_force_delete',
        description: 'السماح بحذف نوع مخالفة نهائياً',
    },
    {
        name: 'عرض أنواع المخالفات',
        slug: 'violationType_index',
        description: 'السماح بعرض قائمة أنواع المخالفات',
    },
    {
        name: 'استعادة نوع مخالفة',
        slug: 'violationType_restore',
        description: 'السماح باستعادة نوع مخالفة محذوف',
    },
    {
        name: 'عرض نوع مخالفة',
        slug: 'violationType_show',
        description: 'السماح بعرض تفاصيل نوع مخالفة',
    },
    {
        name: 'تعديل نوع مخالفة',
        slug: 'violationType_update',
        description: 'السماح بتعديل بيانات نوع مخالفة',
    },
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

        for (const permission of permissions) {
            let existingPermission = await db.orm.public.Permission
                .where({
                    slug: permission.slug,
                })
                .first();

            if (!existingPermission) {
                existingPermission =
                    await db.orm.public.Permission.create(
                        permission,
                    );

                console.log(
                    `Permission created: ${permission.slug}`,
                );
            } else {
                console.log(
                    `Permission already exists: ${permission.slug}`,
                );
            }

            permissionRecords[permission.slug] =
                existingPermission;
        }

        /* ---------------------------------------------------------
         * Admin Permissions
         * --------------------------------------------------------- */

        const adminRole = roleRecords['admin'];

        for (const permission of permissions) {
            const permissionRecord =
                permissionRecords[permission.slug];

            const existingRolePermission =
                await db.orm.public.RolePermission
                    .where({
                        roleId: adminRole.id,
                        permissionId: permissionRecord.id,
                    })
                    .first();

            if (!existingRolePermission) {
                await db.orm.public.RolePermission.create({
                    roleId: adminRole.id,
                    permissionId: permissionRecord.id,
                });

                console.log(
                    `Permission assigned to admin: ${permission.slug}`,
                );
            }
        }

        /* ---------------------------------------------------------
         * Police Officer Permissions
         * --------------------------------------------------------- */

        const officerRole =
            roleRecords['police_officer'];

        for (const permissionName of officerPermissions) {
            const permission =
                permissionRecords[permissionName];

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

        const accountantRole =
            roleRecords['accountant'];

        for (const permissionName of accountantPermissions) {
            const permission =
                permissionRecords[permissionName];

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

                console.log(`Permission assigned to accountant: ${permissionName}`);
            }
        }

        console.log('\nRoles and permissions seeding completed successfully.');
    } catch (error) {
        console.error('Failed to seed roles and permissions:', error);

        process.exitCode = 1;
    }
}

seedRoles();