import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { PeerType } from 'fireblocks-sdk';

export class DeployTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class MintTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uri: string;
}

export class RegisterTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class TransferNftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  asset: string;

  @ApiProperty({ enum: PeerType})
  @IsNotEmpty()
  sourceType: PeerType;

  @ApiProperty({ enum: PeerType})
  @IsNotEmpty()
  destinationType: PeerType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fromAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toAddress: string;
}
