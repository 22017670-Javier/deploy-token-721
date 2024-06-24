import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { TokenService } from 'src/services/Token/token.service';
import {
  DeployTokenDto,
  RegisterTokenDto,
  MintTokenDto,
  TransferNftDto,
} from './token.dtos';
import { BaseResponse } from 'src/base/base-response';
import { ApiOperation } from '@nestjs/swagger';
import { get } from 'http';
import { PeerType } from 'fireblocks-sdk';

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

  @Get('retrieve-wallet-address')
  @ApiOperation({
    summary: 'Retrieve wallet address',
  })
  async getWalletAddress(): Promise<BaseResponse> {
    try {
      const walletAddress = await this.tokenService.getWalletAddress();
      return {
        success: true,
        message: 'Wallet address retrieved successfully',
        data: { walletAddress },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('balance')
  @ApiOperation({
    summary: 'Get the balance of a NFT',
  })
  async getBalance(): Promise<BaseResponse> {
    try {
      const balance = await this.tokenService.getBalance();

      return {
        success: true,
        message: 'Balance retrieved successfully',
        data: { balance },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('transfer-nft')
  @ApiOperation({
    summary: 'Transfer an NFT',
  })
  async transferNft(@Body() dto: TransferNftDto): Promise<BaseResponse> {
    try {
      const transformedDto = {
        ...dto,
        sourceType: dto.sourceType as PeerType,
        destinationType: dto.destinationType as PeerType,
      };
      const result = await this.tokenService.transferNft(transformedDto);
      return {
        success: true,
        message: 'NFT transferred successfully',
        data: { result },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
