import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterRequestDto } from './dtos';

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
}
