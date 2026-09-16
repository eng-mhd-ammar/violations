import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CURRENCY_REPOSITORY, CurrencyRepository } from '../domain/currency.repository.js';
import { CreateCurrencyDto } from '../presentation/http/dto/create-currency.dto.js';
import { Currency, CurrencyAttributes } from '../domain/currency.model.js';
import { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { UpdateCurrencyDto } from '../presentation/http/dto/update-currency.dto.js';

@Injectable()
export class CurrenciesService {
    constructor(@Inject(CURRENCY_REPOSITORY) private readonly currencyRepository: CurrencyRepository) {}

    async create(dto: CreateCurrencyDto): Promise<Currency> {
        const currency = new Currency({
            name: dto.name,
            code: dto.code,
        });

        return this.currencyRepository.create(currency);
    }

    async findAll(options: QueryOptions = {}) {
        return this.currencyRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Currency> {
        const currency = await this.currencyRepository.find(id, options);

        if (!currency) {
            throw new NotFoundException(`Currency with id ${id} not found`);
        }

        return currency;
    }

    async update(id: number, dto: UpdateCurrencyDto): Promise<Currency> {
        const currency = await this.findById(id);

        if (dto.name !== undefined) {
            currency.changeName(dto.name);
        }

        if (dto.code !== undefined) {
            currency.changeCode(dto.code);
        }

        const data: Partial<CurrencyAttributes> = {
            name: currency.name,
            code: currency.code,
        };

        return this.currencyRepository.update(id, data);
    }

    async delete(id: number): Promise<Currency> {
        await this.findById(id);

        return this.currencyRepository.delete(id);
    }

    async restore(id: number): Promise<Currency> {
        const currency = await this.currencyRepository.find(id, { trashed: 'only' });

        if (!currency) {
            throw new NotFoundException(`Currency with id ${id} not found`);
        }

        if (!currency.deletedAt) {
            return currency;
        }
        
        // Check active currency with the same name
        const activeCurrencyByName =
            await this.currencyRepository.findOneBy({
                name: currency.name,
                deletedAt: null,
            });

        if (activeCurrencyByName) {
            throw new ConflictException(`Cannot restore currency "${currency.name}" because an active currency with the same name already exists.`);
        }
        
        // Check active currency with the same name
        const activeCurrencyByCode =
            await this.currencyRepository.findOneBy({
                name: currency.name,
                deletedAt: null,
            });

        if (activeCurrencyByCode) {
            throw new ConflictException(`Cannot restore currency "${currency.code}" because an active currency with the same code already exists.`);
        }

        return this.currencyRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Currency> {
        await this.findById(id);

        return this.currencyRepository.forceDelete(id);
    }
}