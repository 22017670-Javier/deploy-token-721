import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

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
