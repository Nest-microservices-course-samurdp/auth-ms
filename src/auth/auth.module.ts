import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.SECRET_JWT,
      signOptions: { expiresIn: '30s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
