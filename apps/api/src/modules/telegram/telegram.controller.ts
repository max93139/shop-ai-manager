import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TelegramService, type BroadcastPostDto } from './telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('broadcast')
  @UseGuards(JwtAuthGuard)
  async broadcast(@Body() dto: BroadcastPostDto) {
    return this.telegramService.broadcastToChannel(dto);
  }
}
