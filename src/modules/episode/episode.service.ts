import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpisodeRequestDto } from './dtos/requests/create_episode.request.dto';

type Filter =
  | { type: 'character'; value: string }
  | { type: 'name'; value: string }
  | { type: 'code'; value: string };
@Injectable()
export class EpisodeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(request: CreateEpisodeRequestDto) {
    try {
      const character = this.prismaService.episode.create({
        data: {
          code: request.code,
          name: request.name,
          url: request.url,
        },
      });

      return character;
    } catch (error) {
      console.log({ code: error.code });
      if (error.code === 'P2002') {
        const field = error.meta.target.split('_')[1];
        throw new ConflictException({
          error: {
            field,
            message: `${field} no disponible, Intenta con otro`,
            code: HttpStatus.CONFLICT,
          },
        });
      }
      throw new InternalServerErrorException();
    }
  }

  async suspend(id: string) {
    try {
      const episode = await this.prismaService.episode.update({
        where: {
          id,
        },
        data: {
          state: 'SUSPENDED',
        },
      });
      return episode;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException('Invalid ID');
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(`${id} not found`);
      }
      throw new InternalServerErrorException();
    }
  }

  async getAll(input: Filter & { page: number; limit: number }) {
    switch (input.type) {
      case 'name': {
        const episodes = await this.prismaService.episode.findFirst({
          where: {
            name: {
              startsWith: input.value,
            },
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });
        return episodes;
      }
      case 'character': {
        const episodes = await this.prismaService.characterEpisode.findMany({
          where: {
            characterID: input.value,
          },
        });
        return episodes;
      }
      case 'code': {
        console.log({ in: input.value });
        const episodes = await this.prismaService.episode.findFirst({
          where: {
            code: {
              startsWith: input.value,
            },
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });
        console.log({ episodes });
        return episodes;
      }
    }
  }

  async getOne(id: string) {
    try {
      const character = await this.prismaService.episode.findFirst({
        where: {
          id,
        },
      });

      if (!character) {
        throw new NotFoundException();
      }

      return character;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException('Invalid ID');
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(`${id} not found`);
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          error: {
            message: 'Entry not found',
            code: HttpStatus.NOT_FOUND,
          },
        });
      }

      throw new InternalServerErrorException();
    }
  }

  async delete(id: string) {
    try {
      const episode = await this.prismaService.episode.update({
        where: {
          id,
        },
        data: {
          state: 'AVAILABLE',
        },
      });

      return episode;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException('Invalid ID');
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(`${id} not found`);
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          error: {
            message: 'Entry not found',
            code: HttpStatus.NOT_FOUND,
          },
        });
      }

      throw new InternalServerErrorException();
    }
  }

  async deleteCharacterEpisode(id: string) {
    try {
      const episode = await this.prismaService.characterEpisode.delete({
        where: {
          id,
        },
      });

      return episode;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new BadRequestException('Invalid ID');
      }

      if (error.code === 'P2025') {
        throw new BadRequestException(`${id} not found`);
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          error: {
            message: 'Entry not found',
            code: HttpStatus.NOT_FOUND,
          },
        });
      }

      throw new InternalServerErrorException();
    }
  }
}
