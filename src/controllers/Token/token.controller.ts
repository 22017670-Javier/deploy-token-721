import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TokenService } from 'src/services/Token/token.service';
import { TokenDto, TokenTransferDto } from './token.dtos';
import { BaseResponse } from 'src/base/base-response';
import { ApiOperation } from '@nestjs/swagger';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('deploy')
  @ApiOperation({
    summary: 'Deploy tokens to testnet',
  })
  async deployToken(@Body() dto: TokenDto): Promise<BaseResponse> {
    const token = await this.tokenService.deployToken(dto);

    return {
      success: true,
      message: 'Token deployed successfully',
      data: { token },
    };
  }

  @Post('transfer')
  @ApiOperation({
    summary: 'Transfer tokens between accounts',
  })
  async TransferToken(@Body() dto: TokenTransferDto): Promise<BaseResponse> {
    try {
      const receipt = await this.tokenService.transfer(
        dto.contractAddress,
        dto.recipient,
        dto.amount,
      );
      return {
        success: true,
        message: 'Token transferred successfully',
        data: { receipt },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
