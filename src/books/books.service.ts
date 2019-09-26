import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './books.interface';
import * as jwt from "jwt-then";

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('Books') private readonly booksModel: Model<Book>,
  ) { }

  async findAll(): Promise<Book[]> {
    const books = await this.booksModel.find();
    return books;
  }

  async addBook(req, res): Promise<Book[] | HttpException > {
    const token: string = req.headers.authorization.split(" ")[1];

    const decoded = await jwt.verify(token, 'secret');
    if ((<any>decoded).role !== 'admin') {
      return new HttpException('The book was not added. You are not admin', 401);
    }

    const newBook: Book = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      cover: req.body.cover,
      price: req.body.price,
      quantity: 0
    };

    if (req.body.title) {
      const createdUser = new this.booksModel(newBook);
      await createdUser.save();

      return res.status(201).send({ success: true, message: "Book added" });
    } else throw new HttpException('The book was not added. You are not admin', 401);
  }

  async searchBook(req, res): Promise<Book[]> {
    const searched = req.params.title;
    const str = new RegExp('\w*' + searched + '\w*', 'i')

    const books = await this.booksModel.find({ title: str })

    if (books) {
      throw new HttpException(books, 200)
    } else throw new HttpException('Books not found', 404)
  } 
}