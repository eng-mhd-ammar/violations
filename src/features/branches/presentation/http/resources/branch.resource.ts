import { UserResource } from '../../../../iam/users/presentation/http/resources/user.resource.js';
import { AddressResource } from '../../../../locations/addresses/presentation/http/resources/address.resource.js';
import { Branch } from '../../../domain/branch.model.js';

export interface BranchResourceData {
    id: number | undefined;
    name: string;
    phone: string;
    code: string;
    addressId: number | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | null;

    users: ReturnType<typeof UserResource.make>[];
    address: ReturnType<typeof AddressResource.make> | null;
}

export class BranchResource {

    static make(branch: Branch): BranchResourceData {
        
        const resource: BranchResourceData = {
            id: branch.id,
            name: branch.name,
            phone: branch.phone,
            code: branch.code,
            addressId: branch.addressId,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt,
            deletedAt: branch.deletedAt,

            users: Array.isArray(branch.users)? UserResource.collection(branch.users): [],

            address: branch.address? AddressResource.make(branch.address): null,
        };

        return resource;
    }

    static collection(branches: Branch[]): BranchResourceData[] {
        return branches.map(
            (branch) => this.make(branch),
        );
    }
}