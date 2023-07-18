import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CharacterGender,
  CharacterState,
  CharacterStatus,
  Specy,
} from '@prisma/client';
import { GetResult } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterRequestDto, UpdateCharacterRequestDto } from './dtos';

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
      console.log({ error: error.message });
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

  async asignEpisodes(id: string, episodes_code: string[]) {
    const res = await Promise.all(
      episodes_code.map((episode) =>
        this.prismaService.episode.update({
          where: {
            id: episode,
          },
          data: {
            characterIDs: {
              push: id,
            },
          },
        }),
      ),
    );
    console.log({ res });

    return true;
  }

  async getAll(input: Filter & { page: number; limit: number }) {
    let characters: GetResult<
      {
        id: string;
        name: string;
        status: CharacterStatus;
        specy: Specy;
        gender: CharacterGender;
        image: string;
        created: Date;
        state: CharacterState;
      },
      never
    >[];

    switch (input.type) {
      case 'specy':
        characters = await this.prismaService.character.findMany({
          where: {
            specy: input.value,
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });
        break;
      case 'status':
        characters = await this.prismaService.character.findMany({
          where: {
            status: input.value,
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });
        break;
      case 'state':
        characters = await this.prismaService.character.findMany({
          where: {
            state: input.value,
          },
          take: input.limit,
          skip: input.limit * input.page - 1,
        });

        break;
      default:
        characters = await this.prismaService.character.findMany({
          take: 10,
        });
        break;
    }
    return characters;
  }

  async getOne(id: string) {
    try {
      const character = await this.prismaService.character.findFirst({
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
}
