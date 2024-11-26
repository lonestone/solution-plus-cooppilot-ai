import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WhisperService } from './whisper.service';

@Controller('whisper')
export class WhisperController {
  constructor(private readonly whisperService: WhisperService) {}

  @Post('transcript')
  @UseInterceptors(FileInterceptor('audio'))
  async transcript(@UploadedFile() file: Express.Multer.File) {
    return this.whisperService.getTranscript(file);
  }
}
