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
