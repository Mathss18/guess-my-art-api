import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { OpenaiService } from '../openai/openai.service';
import { PrismaService } from '../database/prisma.service';
import { GetRandomImageDto } from './dto/get-random-image.dto';
import { FolderEnum, S3Service } from '../aws/s3/s3.service';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class ImagesService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}
  async create(createImageDto: CreateImageDto) {
    const imageUrl = await this.openaiService.createImage(createImageDto.text);

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');

    const s3ImageUrl = await this.s3Service.upload(
      uuidv4(),
      buffer,
      FolderEnum.ARTS,
    );

    await this.prismaService.images.create({
      data: {
        title: createImageDto.text,
        url: s3ImageUrl,
        userName: 'test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    return imageUrl;
  }

  async getRandomImage(getRandomImageDto: GetRandomImageDto) {
    return await this.prismaService.images.findFirst({
      where: {
        id: {
          notIn: getRandomImageDto.exclude,
        },
      },
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
  }

  async getPercentage(prompt: string): Promise<string> {
    return await this.openaiService.getPercentage(prompt);
  }
}
