import { Model } from 'mongoose';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/users.interface';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import * as jwtr from "jwt-then"
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  public jwtService: JwtService;
  
  constructor(
    private readonly usersService: UsersService,
    @InjectModel('Roles') private readonly rolesModel: Model<User>,
    @InjectModel('Users') private readonly userModel: Model<User>,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const matchPasswords = await bcrypt.compare(password, user.password);
    if (user && matchPasswords) {
      return user;
    } else throw new UnauthorizedException('Email or password incorrect', '401');
  }


  async login(user: any) {
    const userRole: any = await this.rolesModel.findOne({_id: user.roles[0]})

    const payload = {
      id: user.id,
      role: userRole.role
    };
    const token = await jwtr.sign(payload, "secret")

    return {
      data: token
    };
  }

  async registerNewUser(req, res): Promise<any> {
    const userRole: any = await this.rolesModel.findOne({role: 'user'})

    const newUser: any = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      img: req.body.img,
      roles: []
    };
    newUser.roles.push(userRole._id)

    try {
      const matchUser: any = await this.userModel.findOne({ email: req.body.email })

      if (!matchUser) {
        const createdUser = new this.userModel(newUser);
        await createdUser.save();
        return res.status(200).send({
          success: true,
          message: "User Successfully created"
        });
      } else {
        return res.status(401).send({
          success: false,
          message: `User with e-mail "${matchUser.email}" alredy exist!`
        });
      }

    } catch (err) { 
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }
}
