import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { HttpResponse } from '../utils/http-response.util';
import { Response } from 'express';
import { GetRandomImageDto } from './dto/get-random-image.dto';
import { GuessImageDto } from './dto/guess-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('new')
  async create(@Body() createImageDto: CreateImageDto, @Res() res: Response) {
    try {
      const imageUrl = await this.imagesService.create(createImageDto);
      return res.status(HttpStatus.OK).json(
        HttpResponse.build({
          data: {
            imageUrl,
            userPrompt: createImageDto.text,
          },
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpResponse.build({ success: false, message: error.message }));
    }
  }

  @Post('random')
  async getRandomImage(
    @Body() getRandomImageDto: GetRandomImageDto,
    @Res() res: Response,
  ) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpResponse.build({
          data: await this.imagesService.getRandomImage(getRandomImageDto),
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpResponse.build({ success: false, message: error.message }));
    }
  }

  @Post('guess')
  async guess(@Body() guessImageDto: GuessImageDto, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json(
        HttpResponse.build({
          data: {
            percentage: await this.imagesService.getPercentage(
              guessImageDto.text,
            ),
          },
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(HttpResponse.build({ success: false, message: error.message }));
    }
  }
}
