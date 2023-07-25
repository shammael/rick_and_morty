import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CharacterState, CharacterStatus, Specy } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dtos';
import { AsignEpisodesRequestDto } from './dtos/requests/asign_episode.request.dto';
import { Location } from './interface/episode_data';

export type Filter =
  | { type: 'specy'; value: Specy }
  | { type: 'status'; value: CharacterStatus }
  | { type: 'state'; value: CharacterState };

@Injectable()
export class CharacterService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(request: CreateCharacterRequestDto) {
    try {
      const character = await this.prismaService.character.create({
        data: {
          gender: request.gender,
          image: request.image,
          name: request.name,
          specy: request.specy,
          status: request.status,
        },
      });
      return character;
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta.target === 'Character_name_specy_key') {
          throw new ConflictException({
            error: {
              message: `Not available name: ${request.name}, specy: ${request.specy} `,
              code: HttpStatus.CONFLICT,
            },
          });
        }
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

  async delete(id: string) {
    try {
      const character = await this.prismaService.character.update({
        where: {
          id,
        },
        data: {
          state: 'INACTIVE',
        },
      });
      return character;
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

  async update(id: string, request: UpdateCharacterRequestDto) {
    try {
      const character = await this.prismaService.character.update({
        where: {
          id,
        },
        data: {
          ...request,
        },
      });
      return character;
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

  async asignEpisodes(id: string, request: AsignEpisodesRequestDto) {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        for (const episode of request.episodes_data) {
          const episodeDB = await prisma.episode.findFirst({
            where: {
              code: episode.code,
            },
          });

          if (!episodeDB) {
            throw new NotFoundException({
              error: {
                message: `The episode code ${episode.code} not available to perfom this operation`,
                code: HttpStatus.NOT_FOUND,
              },
            });
          }

          const episodeCharacters = episode.locations.map((location) => ({
            from_time: new Date(location.from),
            to_time: new Date(location.to),
            characterID: id,
            episodeID: episodeDB.id,
          }));

          await this.overlapChecking(episode.code, episodeCharacters);

          await prisma.characterEpisode.createMany({
            data: episodeCharacters,
          });
        }
      });

      return true;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.getResponse());
      }

      if (error instanceof BadRequestException) {
        throw new NotFoundException(error.getResponse());
      }

      throw new InternalServerErrorException();
    }
  }

  private async overlapChecking(episodeCode: string, locations: Location[]) {
    const overlap_check = await this.prismaService.characterEpisode.findMany({
      where: {
        episode: {
          code: episodeCode,
          characters: {
            some: {
              OR: locations.map((character) => ({
                from_time: {
                  lt: character.from_time,
                },
                to_time: {
                  lt: character.to_time,
                },
              })),
            },
          },
        },
      },
    });

    console.log({ overlap_check });

    if (overlap_check.length > 0) {
      throw new BadRequestException({
        error: {
          message: `The episode ${episodeCode} has overlap`,
          code: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async getAll(input: Filter & { page: number; limit: number }) {
    switch (input.type) {
      case 'specy': {
        const characters = await this.prismaService.character.findMany({
          where: {
            specy: input.value,
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });
        return characters;
      }
      case 'status': {
        const characters = await this.prismaService.character.findMany({
          where: {
            status: input.value,
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });

        return characters;
      }
      case 'state': {
        const characters = await this.prismaService.character.findMany({
          where: {
            state: input.value,
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });
        return characters;
      }
      default: {
        const characters = await this.prismaService.character.findMany({
          take: 10,
        });
        return characters;
      }
    }
  }

  async getOne(id: string) {
    try {
      const character = await this.prismaService.character.findFirstOrThrow({
        where: {
          id,
        },
      });

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
}
