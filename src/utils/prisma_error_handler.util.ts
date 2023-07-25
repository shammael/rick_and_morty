import { BadRequestException } from '@nestjs/common';

type PrismaErrorCode = 'P2023' | 'P2025';

export function prismaErrorHandler(errorCode: PrismaErrorCode, data?: any) {
  if (errorCode === 'P2023') {
    throw new BadRequestException('Invalid ID');
  }

  if (errorCode === 'P2025') {
    throw new BadRequestException(`${data} not found`);
  }
}
