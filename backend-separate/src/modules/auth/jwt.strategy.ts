import { Injectable, UnauthorizedException } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaRepository } from '../../prisma/prisma.repository';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(
    private configService: ConfigService,
    private prismaRepository: PrismaRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prismaRepository.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const { password: _, ...result } = user;
    return result;
  }
}
