import { CitizenResource } from '../../../../../citizens/presentation/http/resources/citizen.resource.js';
import { CurrencyResource } from '../../../../../payments/currencies/presentation/http/resources/currency.resource.js';
import { UserResource } from '../../../../../iam/users/presentation/http/resources/user.resource.js';
import { Violation } from '../../../domain/violation.model.js';
import { ViolationTypeResource } from '../../../../violation-types/presentation/http/resources/violation-type.resource.js';
import { BranchResource } from '../../../../../branches/presentation/http/resources/branch.resource.js';

export interface ViolationResourceData {
    id: number | undefined;

    violationNumber: string;

    citizenId: number;
    violationTypeId: number;
    branchId: number;
    officerId: number;
    paidCurrencyId: number;

    plateNumber: string;
    plateCode: string;
    plateCategory: string;
    vehicleType: string;
    make: string;
    model: string;
    color: string;
    manufactureYear: string;

    status: string;
    fineAmount: number;
    violationDate: string;
    location: string;
    cancelledAt?: string;

    citizen?: ReturnType<typeof CitizenResource.make>;
    violationType?: ReturnType<typeof ViolationTypeResource.make>;
    branch?: ReturnType<typeof BranchResource.make>;
    officer?: ReturnType<typeof UserResource.make>;
    paidCurrency?: ReturnType<typeof CurrencyResource.make>;
}

export class ViolationResource {

    static make(violation: Violation): ViolationResourceData {

        const resource: ViolationResourceData = {
            id: violation.id,
            violationNumber: violation.violationNumber,
            citizenId: violation.citizenId,
            violationTypeId: violation.violationTypeId,
            branchId: violation.branchId,
            officerId: violation.officerId,
            paidCurrencyId: violation.paidCurrencyId,
            plateNumber: violation.plateNumber,
            plateCode: violation.plateCode,
            plateCategory: violation.plateCategory,
            vehicleType: violation.vehicleType,
            make: violation.make,
            model: violation.model,
            color: violation.color,
            manufactureYear: violation.manufactureYear,
            status: violation.status,
            fineAmount: violation.fineAmount,
            violationDate: violation.violationDate,
            location: violation.location,
            cancelledAt: violation.cancelledAt,
        };

        if (violation.citizen) {
            resource.citizen = CitizenResource.make(violation.citizen);
        }

        if (violation.violationType) {
            resource.violationType = ViolationTypeResource.make(violation.violationType);
        }

        if (violation.branch) {
            resource.branch = BranchResource.make(violation.branch);
        }

        if (violation.officer) {
            resource.officer = UserResource.make(violation.officer);
        }

        if (violation.paidCurrency) {
            resource.paidCurrency = CurrencyResource.make(violation.paidCurrency);
        }

        return resource;
    }

    static collection(violations: Violation[]): ViolationResourceData[] {
        return violations.map(
            (violation) =>
                this.make(
                    violation,
                ),
        );
    }
}