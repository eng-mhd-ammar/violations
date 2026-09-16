import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';
import { BRANCH_REPOSITORY, BranchRepository } from '../domain/branch.repository.js';
import { Branch, BranchAttributes } from '../domain/branch.model.js';
import { UpdateBranchDto } from '../presentation/http/dto/update-branch.dto.js';
import { CreateBranchDto } from '../presentation/http/dto/create-branch.dto.js';

@Injectable()
export class BranchesService {
    constructor(@Inject(BRANCH_REPOSITORY) private readonly branchRepository: BranchRepository) {}

    async create(dto: CreateBranchDto): Promise<Branch> {
        const branch = new Branch({
            name: dto.name,
            phone: dto.phone,
            code: dto.code,
            addressId: dto.addressId,
        });

        return this.branchRepository.create(branch);
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

        if (dto.addressId !== undefined) {
            branch.changeAddressId(dto.addressId);
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
        await this.findById(id);

        return this.branchRepository.delete(id);
    }

    async restore(id: number): Promise<Branch> {
        const branch = await this.branchRepository.find(id, { trashed: 'only' });

        if (!branch) {
            throw new NotFoundException(`Branch with id ${id} not found`);
        }

        if (!branch.deletedAt) {
            return branch;
        }
        
        // Check active branch with the same name
        const activeBranchByName =
            await this.branchRepository.findOneBy({
                name: branch.name,
                deletedAt: null,
            });

        if (activeBranchByName) {
            throw new ConflictException(`Cannot restore branch "${branch.name}" because an active branch with the same name already exists.`);
        }
        
        // Check active branch with the same name
        const activeBranchByPhone =
            await this.branchRepository.findOneBy({
                phone: branch.phone,
                deletedAt: null,
            });

        if (activeBranchByPhone) {
            throw new ConflictException(`Cannot restore branch "${branch.phone}" because an active branch with the same phone already exists.`);
        }
        
        // Check active branch with the same name
        const activeBranchByCode =
            await this.branchRepository.findOneBy({
                name: branch.name,
                deletedAt: null,
            });

        if (activeBranchByCode) {
            throw new ConflictException(`Cannot restore branch "${branch.code}" because an active branch with the same code already exists.`);
        }

        return this.branchRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Branch> {
        await this.findById(id);

        return this.branchRepository.forceDelete(id);
    }
}