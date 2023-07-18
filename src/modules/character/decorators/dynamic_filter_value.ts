import { BadRequestException, HttpStatus } from '@nestjs/common';
import { CharacterState, CharacterStatus, Specy } from '@prisma/client';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function DynamicFilterValue(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'dynamicFilterValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { object } = args;
          const filterType: 'specy' | 'status' | 'state' =
            object['filter_type'];

          if (filterType === 'specy' && !(value in Specy)) {
            throw new BadRequestException({
              error: {
                message: `${value} is not a valid specy name`,
                field: propertyName,
                value,
              },
              code: HttpStatus.BAD_REQUEST,
            });
          }

          if (filterType === 'state' && !(value in CharacterState)) {
            throw new BadRequestException({
              error: {
                message: `${value} is not a valid state`,
                field: propertyName,
                value,
              },
              code: HttpStatus.BAD_REQUEST,
            });
          }

          if (filterType === 'status' && !(value in CharacterStatus)) {
            throw new BadRequestException({
              error: {
                message: `${value} is not a valid status`,
                field: propertyName,
                value,
              },
              code: HttpStatus.BAD_REQUEST,
            });
          }

          return true;
        },
      },
    });
  };
}
