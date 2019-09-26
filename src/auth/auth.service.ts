import { Model } from 'mongoose';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/users.interface';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import * as jwtr from "jwt-then"

@Injectable()
export class AuthService {
  public jwtService: JwtService;
  
  constructor(
    @InjectModel('Roles') private readonly rolesModel: Model<User>,
    @InjectModel('Users') private readonly userModel: Model<User>,
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({email: email});
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

  async registerNewUser(req, res): Promise<User[]> {
    const userRole: any = await this.rolesModel.findOne({role: 'user'})

    const newUser: User = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      img: req.body.img,
      roles: []
    };
    newUser.roles.push(userRole._id)
    const matchUser: User = await this.userModel.findOne({ email: req.body.email })

    if (!matchUser) {
      const createdUser = new this.userModel(newUser);
      await createdUser.save();
      return res.status(201).send({ success: true, message: "User Successfully created" });
    } else {
      throw new UnauthorizedException(`User with e-mail "${matchUser.email}" alredy exist!`, '401');
    }
  }
}
