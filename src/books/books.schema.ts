import { Schema } from 'mongoose';

export const BookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  cover: String,
  price: Number,
  quantity: Number
});