/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'BookedBedLimitValidator', async: false })
export class BookedBedLimitValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments: ValidationArguments): Promise<boolean> | boolean {
        const object = validationArguments.object as any;
        return object.numberOfBookedBeds <= object.numberOfBeds;
    }
    defaultMessage?(validationArguments: ValidationArguments): string {
        return 'Number of booked beds can\'t be greater than total number of beds.';
    }
}

export function BookedBedLimit(validationOptions: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'BookedBedLimit',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: BookedBedLimitValidator,
        })
    }
}