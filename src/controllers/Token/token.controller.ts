import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TokenService } from 'src/services/Token/token.service';
import {
  TokenApproveDto,
  TokenDto,
  TokenTransferDto,
  TokenTransferFromDto,
  MintTokenDto,
  BurnTokenDto,
} from './token.dtos';
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

  @Post('approve')
  @ApiOperation({
    summary:
      'Authorises another account to withdraw a specified number of tokens from your account',
  })
  async ApproveToken(@Body() dto: TokenApproveDto): Promise<BaseResponse> {
    try {
      const receipt = await this.tokenService.approve(
        dto.contractAddress,
        dto.spender,
        dto.amount,
      );
      return {
        success: true,
        message: 'Token approved successfully',
        data: { receipt },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('transferFrom')
  @ApiOperation({
    summary:
      'Authorises another account to transact a specified number of tokens from the approve method',
  })
  async TransferFromToken(
    @Body() dto: TokenTransferFromDto,
  ): Promise<BaseResponse> {
    try {
      const receipt = await this.tokenService.transferFrom(
        dto.sender,
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

  @Post('mint')
  @ApiOperation({
    summary:
      'Creates new tokens and adds them to the total supply of the token',
  })
  async MintToken(@Body() dto: MintTokenDto): Promise<BaseResponse> {
    try {
      const receipt = await this.tokenService.mint(
        dto.contractAddress,
        dto.account,
        dto.amount,
      );
      return {
        success: true,
        message: 'Token minted successfully',
        data: { receipt },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('burn')
  @ApiOperation({
    summary: 'Removes tokens from the current total supply',
  })
  async BurnToken(@Body() dto: BurnTokenDto): Promise<BaseResponse> {
    try {
      const receipt = await this.tokenService.burn(
        dto.contractAddress,
        dto.account,
        dto.amount,
      );
      return {
        success: true,
        message: 'Token burnt successfully',
        data: { receipt },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
