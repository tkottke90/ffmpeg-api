import { Controller, Next, Response, Request, Post } from '@decorators/express';
import express from 'express';
import { Inject } from '@decorators/di';
import { FfmpegService } from '../services/ffmpeg.service';
import { MulterFile, UploadAudio } from '../middleware/multer.middleware';
import { BadRequestError } from '../utilities/errors.util';
import { FileSystemService } from '../services/fileSystem.service';
import { LoggerService } from '../services';

@Controller('/convert')
export class ConvertController {
  constructor(
    @Inject('FfmpegService') private readonly ffmpeg: FfmpegService,
    @Inject('FileSystemService') private readonly fileSystem: FileSystemService
  ) {}

  @Post('/', [UploadAudio])
  async convertAudio(
    @Request('file') file: MulterFile,
    @Response() res: express.Response,
    @Next() next: express.NextFunction
  ) {
    let result = '';

    try {
      if (!file) {
        throw new BadRequestError('No File Provided');
      }

      result = await this.ffmpeg.convert(file.path);

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
