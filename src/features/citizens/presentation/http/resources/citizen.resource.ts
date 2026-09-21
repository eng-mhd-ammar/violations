import { AddressResource } from '../../../../locations/addresses/presentation/http/resources/address.resource.js';
import { Citizen } from '../../../domain/citizen.model.js';

export interface CitizenResourceData {
    id: number | undefined;
    nationalId: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    phone: string;
}

export class CitizenResource {

    static make(
        citizen: Citizen,
        includes: string[] = [],
    ): CitizenResourceData {

        const resource: CitizenResourceData = {
            id: citizen.id,
            nationalId: citizen.nationalId,
            firstName: citizen.firstName,
            lastName: citizen.lastName,
            fatherName: citizen.fatherName,
            motherName: citizen.motherName,
            dateOfBirth: citizen.dateOfBirth,
            phone: citizen.phone,
        };

        return resource;
    }

    static collection(
        citizens: Citizen[],
        includes: string[] = [],
    ): CitizenResourceData[] {

        return citizens.map(
            (citizen) => this.make(
                citizen,
                includes,
            ),
        );
    }
}