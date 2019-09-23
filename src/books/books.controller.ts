import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';

@Controller('/books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    findAll(): any {
        return this.booksService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/addBook')
    addBook(@Req() req: Request): any {
        return this.booksService.addBook(req);
    }

    @Get('/:title')
    searchBook(@Req() req: Request, @Res() res: Response): any {
        return this.booksService.searchBook(req, res);
    }
}
