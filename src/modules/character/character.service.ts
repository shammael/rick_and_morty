import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dtos';

@Injectable()
export class CharacterService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(request: CreateCharacterRequestDto) {
    const character = await this.prismaService.character.create({
      data: {
        gender: request.gender,
        image: request.image,
        name: request.name,
        specy: request.specy,
        status: request.status,
        episodeIDs: [],
      },
    });
    return character;
  }

  async delete(id: string) {
    const character = await this.prismaService.character.update({
      where: {
        id,
      },
      data: {
        state: 'INACTIVE',
      },
    });
    return character;
  }

  async update(id: string, request: UpdateCharacterRequestDto) {
    const character = await this.prismaService.character.update({
      where: {
        id,
      },
      data: {
        ...request,
      },
    });
    return character;
  }
}
