import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TelegramService, type BroadcastPostDto } from './telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('broadcast')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async broadcast(
    @Body() dto: BroadcastPostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.telegramService.broadcastToChannel(dto, file);
  }
}
