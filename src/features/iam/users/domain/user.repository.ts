import { User, UserAttributes } from './user.model.js';

export abstract class UserRepository {
    abstract create(user: User): Promise<User>;

    abstract findAll(): Promise<User[]>;

    abstract findById(id: number): Promise<User | null>;

    abstract findByIdIncludingDeleted(id: number): Promise<User | null>;

    abstract findByUsername(username: string): Promise<User | null>;

    abstract findByPhone(phone: string): Promise<User | null>;

    abstract update(id: number, data: Partial<UserAttributes>): Promise<User>;

    abstract delete(id: number): Promise<User>;

    abstract restore(id: number): Promise<User>;
    
    abstract forceDelete(id: number): Promise<User>;
}
