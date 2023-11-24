import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { OpenaiService } from '../openai/openai.service';
import { PrismaService } from '../database/prisma.service';
import { GetRandomImageDto } from './dto/get-random-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prismaService: PrismaService,
  ) {}
  async create(createImageDto: CreateImageDto) {
    const imageUrl = await this.openaiService.createImage(createImageDto.text);
    await this.prismaService.images.create({
      data: {
        title: createImageDto.text,
        url: imageUrl,
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
