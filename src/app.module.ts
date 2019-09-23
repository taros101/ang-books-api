import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';

import config from './config/settings'

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
// import { JwtStrategy } from './auth/jwt.strategy';

import { authProviders } from './auth/auth.providers';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURL),
    UsersModule,
    AuthModule,
    BooksModule
  ],
  controllers: [ AuthController],
  providers: [
    LocalStrategy
  ]
})
export class AppModule {}
