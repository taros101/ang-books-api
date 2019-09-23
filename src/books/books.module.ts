import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookSchema } from './books.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Books', schema: BookSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}