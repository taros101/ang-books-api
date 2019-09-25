import { Controller, Get, Post, Body, Req, Res, Put, Delete ,UseGuards} from '@nestjs/common';
import { UsersService } from './users.service'
import { User } from './users.interface'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import * as Request1 from "@nestjs/common"

@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): any {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    findUser(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.findUser(req, res);
    }

    @Put('/:id')
    changeAvatar(@Req() req: Request, @Res() res: Response ): any {
        return this.usersService.changeAvatar(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('editUser/:id')
    editUser(@Req() req: Request, @Res() res: Response ): any {
        return this.usersService.editUser(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('deleteUser/:id')
    deleteUser(@Req() req: Request, @Res() res: Response ): any {
        return this.usersService.deleteUser(req, res);
    }
}
