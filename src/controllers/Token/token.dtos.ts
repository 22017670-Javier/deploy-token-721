import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class TokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly symbol: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly decimals: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly totalSupply: number;
}

export class TokenTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly recipient: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class TokenApproveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly spender: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class TokenTransferFromDto {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // readonly contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly sender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly recipient: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class MintTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly account: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class BurnTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly account: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}

export class RegisterTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly contractAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly symbol: string;
}
