import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';


import { CreateAddressDto } from '../presentation/http/dto/create-address.dto.js';
import { UpdateAddressDto } from '../presentation/http/dto/update-address.dto.js';
import { AddressRepository } from '../domain/address.repository.js';
import { Address, AddressAttributes } from '../domain/address.model.js';

@Injectable()
export class AddressesService {

    constructor(
        private readonly addressRepository: AddressRepository,
    ) {}

    /**
     * Create a new address
     */
    async create(
        dto: CreateAddressDto,
    ): Promise<Address> {

        const address = new Address({
            stateId: dto.stateId,
            city: dto.city,
            street: dto.street,
        });

        return this.addressRepository.create(address);
    }

    /**
     * Get all addresses
     */
    async findAll(): Promise<Address[]> {
        return this.addressRepository.findAll();
    }

    /**
     * Get address by ID
     */
    async findById(
        id: number,
    ): Promise<Address> {

        const address =
            await this.addressRepository.findById(id);

        if (!address) {
            throw new NotFoundException(
                `Address with id ${id} not found`,
            );
        }

        return address;
    }

    /**
     * Update address
     */
    async update(
        id: number,
        dto: UpdateAddressDto,
    ): Promise<Address> {

        const address =
            await this.findById(id);

        /**
         * Apply domain mutations.
         */
        if (dto.stateId !== undefined) {
            address.changeState(dto.stateId);
        }

        if (dto.city !== undefined) {
            address.changeCity(dto.city);
        }

        if (dto.street !== undefined) {
            address.changeStreet(dto.street);
        }

        /**
         * Persist the updated domain entity.
         */
        const data: Partial<AddressAttributes> = {
            stateId: address.stateId,
            city: address.city,
            street: address.street,
        };

        return this.addressRepository.update(
            id,
            data,
        );
    }

    /**
     * Soft delete address
     */
    async delete(
        id: number,
    ): Promise<Address> {

        const address =
            await this.findById(id);

        await this.addressRepository.delete(id);

        return address;
    }

    /**
     * Restore soft-deleted address
     */
    async restore(
        id: number,
    ): Promise<Address> {

        const address =
            await this.addressRepository
                .findByIdIncludingDeleted(id);

        if (!address) {
            throw new NotFoundException(
                `Address with id ${id} not found`,
            );
        }

        if (!address.deletedAt) {
            return address;
        }

        return this.addressRepository.restore(id);
    }

    /**
     * Force delete address
     */
    async forceDelete(
        id: number,
    ): Promise<Address> {

        const address =
            await this.findById(id);

        await this.addressRepository.forceDelete(id);

        return address;
    }
}