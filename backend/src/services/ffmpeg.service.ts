import { Container, Injectable } from '@decorators/di';
import { exec } from 'child_process';
import { basename, dirname } from 'path';
import { BadRequestError } from '../utilities/errors.util';

@Injectable()
export class FfmpegService {
  async extractAudio(filePath: string) {
    if (filePath.length === 0) {
      throw new BadRequestError('No File Provided');
    }

    const result = await new Promise<string>((res, rej) => {
      const outputFile = this.replaceExtension(filePath);

      exec(
        `ffmpeg -i ${filePath} -acodec pcm_s16le -ac 2 ${outputFile}`,
        (error, stdout, stderr) => {
          if (error) {
            rej(error);
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);

          res(outputFile);
        }
      );
    });

    console.log(result);
    return result;
  }

  async convert(filePath: string, targetFormat: string) {
    if (filePath.length === 0) {
      throw new BadRequestError('No File Provided');
    }

    const result = await new Promise<string>((res, rej) => {
      const outputFile = this.replaceExtension(filePath);

      exec(`ffmpeg -i ${filePath} ${outputFile}`, (error, stdout, stderr) => {
        if (error) {
          rej(error);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        res(outputFile);
      });
    });

    console.log(result);
    return result;
  }

  private replaceExtension(filename: string) {
    const base = basename(filename);
    const path = dirname(filename);

    const baseParts = base.split('.');

    // Remove the extension
    if (baseParts.length > 1) {
      baseParts.pop();
    }

    return `${path}/${baseParts.join('.')}.wav`;
  }
}

Container.provide([{ provide: 'FfmpegService', useClass: FfmpegService }]);
