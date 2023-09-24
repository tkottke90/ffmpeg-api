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
import { LoggerService } from '../services';

@Controller('/')
export class EntrypointController {
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
    let result = '';

    try {
      if (!file) {
        throw new BadRequestError('No File Provided');
      }

      result = await this.ffmpeg.extractAudio(file.path);

      if (!['yes', 'true', '1', 'keep'].includes(keepOriginal)) {
        LoggerService.log('info', 'Removing Input Video File', {
          file: result,
          input: file?.originalname
        });
        await this.fileSystem.removeFile(file.path);
      }

      res.sendFile(result, { root: require.main!.path });
    } catch (error) {
      next(error);
    } finally {
      if (result) {
        LoggerService.log('info', 'Removing Created Audio File', {
          file: result,
          input: file?.originalname
        });
        await this.fileSystem.removeFile(result).catch((rmErr) => {
          LoggerService.error(rmErr as unknown as Error);
        });
      }
    }
  }
}
