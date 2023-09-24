import { Container, Injectable } from '@decorators/di';
import { rm } from 'fs/promises';

@Injectable()
export class FileSystemService {
  async removeFile(path: string) {
    await rm(path);
  }
}

Container.provide([
  { provide: 'FileSystemService', useClass: FileSystemService }
]);
