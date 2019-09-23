import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.interface';
import * as bcrypt from "bcrypt"
import { CreateUserDto } from './create-user.dto';
import * as jwt from "jwt-then";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
    @InjectModel('Roles') private readonly rolesModel: Model<User>
    ) {}
    
  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email: username })
    return user
  }

  async findUser(req, res): Promise<any> {
    try {
      const foundedUser = await this.userModel.findOne({ _id: req.params.id })
      const userRole: any = await this.rolesModel.findOne({_id: foundedUser.roles[0]})

      const user = {
        id: foundedUser.id,
        email: foundedUser.email,
        img: foundedUser.img,
        role: userRole.role
      }
      
      if (user) {
        return res.status(200).send({
          success: true,
          data: user
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });

      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async changeAvatar(req, res): Promise<any> {
    try {
      const newAvatar = req.body.newAvatar
      const check = await this.userModel.findOne({ _id: req.params.id })
  
      if (check) {
        await this.userModel.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              img: newAvatar
            }
          },
          { new: true }
        );

        return res.status(200).send({
          success: true,
          message: 'Update is done'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
    } catch (err) { 
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async editUser(req, res): Promise<any> {
    try {
      const token: string = req.headers.authorization.split(" ")[1];

      const decoded = await jwt.verify(token, 'secret');
      if ((<any>decoded).role !== 'admin') {
        return res.status(401).send({ auth: false, message: "You are not admin" });
      }

      const userUpdated = await this.userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            email: req.body.newEmail
          }
        },
        { new: true }
      );
      if (!userUpdated) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      } else {
        res.status(200).send({
          success: true,
          message: 'Update is done',
        });
      }

    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async deleteUser(req, res): Promise<any> {
    try {
      const token: string = req.headers.authorization.split(" ")[1];

      const decoded = await jwt.verify(token, 'secret');
      if ((<any>decoded).role !== 'admin') {
        return res.status(401).send({ auth: false, message: "You are not admin" });
      }

      const check = await this.userModel.findById(req.params.id);

      if (check) {
        await this.userModel.findByIdAndRemove(req.params.id);

        res.status(200).send({
          success: true,
          message: 'Delete is done'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
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