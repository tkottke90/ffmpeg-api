import {
  Controller,
  Get,
  Next,
  Response,
  Request,
  Post,
  Query
} from '@decorators/express';
import express from 'express';
import pgk from '../../package.json';
import { Inject } from '@decorators/di';
import { FfmpegService } from '../services/ffmpeg.service';
import { MulterFile, UploadVideo } from '../middleware/multer.middleware';
import { BadRequestError } from '../utilities/errors.util';
import { FileSystemService } from '../services/fileSystem.service';

@Controller('/')
export class ServerStatusController {
  constructor(
    @Inject('FfmpegService') private readonly ffmpeg: FfmpegService,
    @Inject('FileSystemService') private readonly fileSystem: FileSystemService
  ) {}

  @Get('/')
  getRoot(@Response() res: express.Response) {
    res.json({ version: pgk.version });
  }

  @Post('/extract-audio', [UploadVideo])
  async extractAudio(
    @Request('file') file: MulterFile,
    @Query('keepOriginal') keepOriginal: string,
    @Response() res: express.Response,
    @Next() next: express.NextFunction
  ) {
    try {
      if (!file) {
        throw new BadRequestError('No File Provided');
      }

      const result = await this.ffmpeg.extractAudio(file.path);

      if (!['yes', 'true', '1', 'keep'].includes(keepOriginal)) {
        await this.fileSystem.removeFile(file.path);
      }

      console.log(require.main);

      res.sendFile(result, { root: require.main!.path });
    } catch (error) {
      next(error);
    }
  }
}
