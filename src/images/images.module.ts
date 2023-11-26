import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { OpenaiService } from '../openai/openai.service';
import { PrismaService } from '../database/prisma.service';
import { S3Service } from '../aws/s3/s3.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, OpenaiService, PrismaService, S3Service],
})
export class ImagesModule {}
