import { Controller, Get, Request, Response, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
    constructor( 
        private readonly authService: AuthService,
        ) { }
    
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post("/signup")
    registerNewUser(@Req() req: Request, @Res() res: Response ): any {
        return this.authService.registerNewUser(req, res);
    }
}
