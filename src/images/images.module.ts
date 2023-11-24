import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { OpenaiService } from '../openai/openai.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, OpenaiService, PrismaService],
})
export class ImagesModule {}
