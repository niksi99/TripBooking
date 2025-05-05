/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";

export class IsRoleAllowedValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments: ValidationArguments): Promise<boolean> | boolean {
        const allowedRoles = validationArguments.constraints[0]; 
        return allowedRoles.includes(value);
    }
    defaultMessage?(validationArguments: ValidationArguments): string {
        return `Role '${validationArguments.value}' is not allowed.`;
    }
}

export function IsAllowedRole(validationOptions: ValidationOptions) {
    return (object: any, propertyName: string) =>
      registerDecorator({
        name: 'IsAllowedRole',
        target: object.constructor,
        propertyName,
        constraints: [],
        options: validationOptions,
        validator: IsRoleAllowedValidator
      });
  }