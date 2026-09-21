import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';
import { BRANCH_REPOSITORY, BranchRepository } from '../domain/branch.repository.js';
import { Branch, BranchAttributes } from '../domain/branch.model.js';
import { UpdateBranchDto } from '../presentation/http/dto/update-branch.dto.js';
import { CreateBranchDto } from '../presentation/http/dto/create-branch.dto.js';
import { ADDRESS_REPOSITORY, AddressRepository } from '../../locations/addresses/domain/address.repository.js';
import { Address } from '../../locations/addresses/domain/address.model.js';

@Injectable()
export class BranchesService {
    constructor(@Inject(BRANCH_REPOSITORY) private readonly branchRepository: BranchRepository, @Inject(ADDRESS_REPOSITORY) private readonly addressRepository: AddressRepository) {}

    async create(dto: CreateBranchDto): Promise<Branch> {
        const address = await this.addressRepository.create(new Address({ stateId: dto.address.stateId, city: dto.address.city, street: dto.address.street }));
        console.log("Address:" + address.id);
        const branch = new Branch({
            name: dto.name,
            phone: dto.phone,
            code: dto.code,
            addressId: address.id, 
        });

        const createdBranch = this.branchRepository.create(branch);

        console.log("Branch: " + createdBranch);

        return createdBranch;
    }

    async findAll(options: QueryOptions = {}) {
        return this.branchRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Branch> {
        const branch = await this.branchRepository.find(id, options);

        if (!branch) {
            throw new NotFoundException(`Branch with id ${id} not found`);
        }
    
        return branch;
    }

    async update(id: number, dto: UpdateBranchDto): Promise<Branch> {
        const branch = await this.findById(id);

        if (dto.name !== undefined) {
            branch.changeName(dto.name);
        }

        if (dto.phone !== undefined) {
            branch.changePhone(dto.phone);
        }

        if (dto.code !== undefined) {
            branch.changeCode(dto.code);
        }

        if (dto.address !== undefined && branch.addressId != null) {
            await this.addressRepository.update(
                branch.addressId,
                {
                    ...(dto.address.stateId !== undefined && {
                        stateId: dto.address.stateId,
                    }),
                    ...(dto.address.city !== undefined && {
                        city: dto.address.city,
                    }),
                    ...(dto.address.street !== undefined && {
                        street: dto.address.street,
                    }),
                },
            );
        }

        const data: Partial<BranchAttributes> = {
            name: branch.name,
            phone: branch.phone,
            code: branch.code,
            addressId: branch.addressId,
        };

        return this.branchRepository.update(id, data);
    }

    async delete(id: number): Promise<Branch> {
        const branch = await this.findById(id);

        await this.branchRepository.delete(id);

        await this.addressRepository.delete(branch.addressId);

        return branch;
    }

    async restore(id: number): Promise<Branch> {
        const branch = await this.branchRepository.find(id, { trashed: 'only' });

        if (!branch) {
            throw new NotFoundException(`Branch with id ${id} not found`);
        }

        if (!branch.deletedAt) {
            return branch;
        }

        const activeBranchByName =
            await this.branchRepository.findOneBy({
                name: branch.name,
                deletedAt: null,
            });

        if (activeBranchByName) {
            throw new ConflictException(`Cannot restore branch "${branch.name}" because an active branch with the same name already exists.`);
        }

        const activeBranchByPhone =
            await this.branchRepository.findOneBy({
                phone: branch.phone,
                deletedAt: null,
            });

        if (activeBranchByPhone) {
            throw new ConflictException(`Cannot restore branch "${branch.phone}" because an active branch with the same phone already exists.`);
        }

        const activeBranchByCode =
            await this.branchRepository.findOneBy({
                code: branch.code,
                deletedAt: null,
            });

        if (activeBranchByCode) {
            throw new ConflictException(`Cannot restore branch "${branch.code}" because an active branch with the same code already exists.`);
        }

        const address = await this.addressRepository.find(branch.addressId, { trashed: 'only' });

        if (!address) {
            throw new NotFoundException(`Address with id ${branch.addressId} not found`);
        }

        await this.addressRepository.restore(branch.addressId);

        return this.branchRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Branch> {
        const branch = await this.branchRepository.find(id, { trashed: 'with' });

        if (!branch) {
            throw new NotFoundException(`Branch with id ${id} not found`);
        }

        const deletedBranch = await this.branchRepository.forceDelete(id);

        await this.addressRepository.forceDelete(
            branch.addressId,
        );

        return deletedBranch;
    }
}