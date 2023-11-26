import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

export enum FolderEnum {
  ARTS = 'arts',
}

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName = 'guess-my-art';
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload(
    filename: string,
    file: Buffer,
    folder: FolderEnum,
  ): Promise<string> {
    const filePath = `${folder}/${filename}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath, // use the new filePath here
        Body: file,
        ACL: 'public-read',
      }),
    );

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;
  }

  async delete(filename: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      }),
    );
  }
}
