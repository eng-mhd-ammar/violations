import { User } from './user.model.js';
import type { UserAttributes } from './user.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export abstract class UserRepository {
    abstract create(user: User): Promise<User>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<User | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<User | null>;

    abstract first(options?: QueryOptions): Promise<User | null>;

    abstract update(id: number, data: Partial<UserAttributes>): Promise<User>;

    abstract delete(id: number): Promise<User>;

    abstract restore(id: number): Promise<User>;

    abstract forceDelete(id: number): Promise<User>;
}