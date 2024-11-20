import { whisperFetcher } from '@common/back-admin/fetchers/whisperFetcher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhisperService {
  constructor() {}

  async getTranscript(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('audio', new Blob([file.buffer]), file.originalname);
    return whisperFetcher({ formData });
  }
}
