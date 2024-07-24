import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TokenService } from 'src/services/Token/token.service';
import { DeployTokenDto, RegisterTokenDto, MintTokenDto } from './token.dtos';
import { BaseResponse } from 'src/base/base-response';
import { ApiOperation } from '@nestjs/swagger';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('deploy')
  @ApiOperation({
    summary: 'Deploy tokens to testnet',
  })
  async deployToken(@Body() dto: DeployTokenDto): Promise<BaseResponse> {
    try {
      const token = await this.tokenService.deployToken(dto);

      return {
        success: true,
        message: 'Token deployed successfully',
        data: { token },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('mint')
  @ApiOperation({
    summary: 'Mint a new token',
  })
  async mintToken(@Body() dto: MintTokenDto): Promise<BaseResponse> {
    try {
      const receipt = await this.tokenService.mintToken(dto);

      return {
        success: true,
        message: 'Token minted successfully',
        data: { receipt },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Post('register')
  // @ApiOperation({
  //   summary: 'Register the deployed token as an asset on Fireblocks',
  // })
  // async RegisterToken(@Body() dto: RegisterTokenDto): Promise<BaseResponse> {
  //   try {
  //     await this.tokenService.registerAssetOnFireblocks(
  //       dto.contractAddress,
  //       dto.symbol,
  //     );
  //     return {
  //       success: true,
  //       message: 'Token registered on Fireblocks successfully',
  //       data: null,
  //     };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
