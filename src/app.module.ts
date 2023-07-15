import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './modules/character/character.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, CharacterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
