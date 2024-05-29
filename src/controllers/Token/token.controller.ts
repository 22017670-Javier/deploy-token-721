import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from 'src/services/Token/token.service';
import { TokenDto } from './token.dtos';
import { BaseResponse } from 'src/base/base-response';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('deploy')
  async deployToken(@Body() dto: TokenDto): Promise<BaseResponse> {
    const token = await this.tokenService.deployToken(dto);

    return {
      success: true,
      message: 'Token deployed successfully',
      data: { token },
    };
  }
}
