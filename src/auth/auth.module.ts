import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/users.schema';
import { RolesSchema } from '../users/roles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Roles', schema: RolesSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, UsersService],
  exports: [AuthService],
})
export class AuthModule {}