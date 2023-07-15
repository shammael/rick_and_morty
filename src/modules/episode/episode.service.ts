import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpisodeRequestDto } from './dtos/requests/create_episode.request.dto';

@Injectable()
export class EpisodeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(request: CreateEpisodeRequestDto) {
    const character = this.prismaService.episode.create({
      data: {
        code: request.code,
        name: request.name,
        url: request.url,
      },
    });

    return character;
  }
}
