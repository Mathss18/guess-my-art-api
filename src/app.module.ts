import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './aws/s3/s3.module';

@Module({
  imports: [
    ImagesModule,
    OpenaiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
