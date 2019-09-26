import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './users.schema';
import { RolesSchema } from '../common/roles.schema';
import { JwtStrategy } from '../common/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Roles', schema: RolesSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}