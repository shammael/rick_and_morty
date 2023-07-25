import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AsignEpisodesRequestDto } from '../dtos/requests/asign_episode.request.dto';

@Injectable()
export class AssignEpisodeGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { episodes_data } = request.body as AsignEpisodesRequestDto;
    const res = await episodes_data.map((episode) => {
      return episode.locations.map((location) => {
        return this.prismaService.characterEpisode.findMany({
          where: {
            from_time: {
              lt: location.from,
            },
            to_time: {
              gt: location.to,
            },
          },
        });
      });
    });

    console.log({ res });

    return true;
  }
}
