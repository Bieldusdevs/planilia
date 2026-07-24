import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'admin@lingeriedonadona.com.br',
  })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'admin123',
  })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  password: string;
}
