import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { ADDRESS_REPOSITORY, AddressRepository } from '../domain/address.repository.js';
import { CreateAddressDto } from '../presentation/http/dto/create-address.dto.js';
import { Address, AddressAttributes } from '../domain/address.model.js';
import { UpdateAddressDto } from '../presentation/http/dto/update-address.dto.js';

@Injectable()
export class AddressesService {
    constructor(@Inject(ADDRESS_REPOSITORY) private readonly addressRepository: AddressRepository) {}

    async create(dto: CreateAddressDto): Promise<Address> {
        const address = new Address({
            city: dto.city,
            street: dto.street,
            stateId: dto.stateId,
        });

        return this.addressRepository.create(address);
    }

    async findAll(options: QueryOptions = {}) {
        return this.addressRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Address> {
        const address = await this.addressRepository.find(id, options);

        if (!address) {
            throw new NotFoundException(`Address with id ${id} not found`);
        }

        return address;
    }

    async update(id: number, dto: UpdateAddressDto): Promise<Address> {
        const address = await this.findById(id);

        if (dto.stateId !== undefined) {
            address.changeStateId(dto.stateId);
        }

        if (dto.city !== undefined) {
            address.changeCity(dto.city);
        }

        if (dto.street !== undefined) {
            address.changeStreet(dto.street);
        }

        const data: Partial<AddressAttributes> = {
            stateId: address.stateId,
            city: address.city,
            street: address.street,
        };

        return this.addressRepository.update(id, data);
    }

    async delete(id: number): Promise<Address> {
        await this.findById(id);

        return this.addressRepository.delete(id);
    }

    async restore(id: number): Promise<Address> {
        const address = await this.addressRepository.find(id, { trashed: 'only' });

        if (!address) {
            throw new NotFoundException(`Address with id ${id} not found`);
        }

        if (!address.deletedAt) {
            return address;
        }

        return this.addressRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Address> {
        await this.findById(id);

        return this.addressRepository.forceDelete(id);
    }
}