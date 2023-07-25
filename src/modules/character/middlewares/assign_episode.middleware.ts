import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { hasTimeOverlap } from 'src/utils/has_time_overlay.util';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AsignEpisodesRequestDto,
  EpisodeDataDto,
} from '../dtos/requests/asign_episode.request.dto';
import { Location } from '../interface/episode_data';

@Injectable()
export class AssignEpisodeMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(
    req: Request<any, any, AsignEpisodesRequestDto> & { episodes: any[] },
    res: Response,
    next: NextFunction,
  ) {
    const episodes_data = req.body.episodes_data;

    if (episodes_data.length > 10) {
      throw new BadRequestException({
        error: {
          message: "You can't process more than 10 episode in a row",
          code: HttpStatus.BAD_REQUEST,
        },
      });
    }

    if (episodes_data.length === 0) {
      throw new BadRequestException({
        error: {
          message: "There's no episode to update",
          code: HttpStatus.BAD_REQUEST,
        },
      });
    }

    try {
      console.log({ episodes_data });

      this.request_episodes_overlap_checker(episodes_data);

      next();
    } catch (error) {
      console.log({ error });
      if (error instanceof BadRequestException) {
        console.log({ error });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        throw new BadRequestException(error.response);
      }
    }
  }

  private request_episodes_overlap_checker(episodes_data: EpisodeDataDto[]) {
    episodes_data.forEach((episode_data) => {
      const timeline: Location[] = [];
      if (episode_data.locations.length > 20) {
        throw new BadRequestException({
          error: {
            message: "You can't process more than 20 locations in a row",
            code: HttpStatus.BAD_REQUEST,
          },
        });
      }

      for (let i = 0; i < episode_data.locations.length; i++) {
        const currentLocation: Location = {
          from_time: new Date(episode_data.locations[i].from),
          to_time: new Date(episode_data.locations[i].to),
        };

        if (currentLocation.from_time > currentLocation.to_time) {
          throw new BadRequestException({
            error: {
              message: "The from time can't be greater than the to time",
              values: {
                from: currentLocation.from_time.toString(),
                to: currentLocation.to_time.toString(),
              },
              code: HttpStatus.BAD_REQUEST,
            },
          });
        }

        if (currentLocation.from_time === currentLocation.to_time) {
          throw new BadRequestException({
            error: {
              message: "The from time and the to time can't be equal",
              values: {
                from: currentLocation.from_time.toString(),
                to: currentLocation.to_time.toString(),
              },
              code: HttpStatus.BAD_REQUEST,
            },
          });
        }

        if (timeline.some((time) => hasTimeOverlap(time, currentLocation))) {
          throw new BadRequestException({
            error: {
              message: `The episode ${episode_data.code} have overlapping position`,
              episode: episode_data.code,
            },
          });
        }
        timeline.push(currentLocation);
      }
    });

    // return false;
    // No hay superposición
  }
}
