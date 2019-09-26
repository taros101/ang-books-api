import { Schema, model } from 'mongoose';

export const UserSchema = new Schema({
  email: String,
  password: String,
  img: String,
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }]
});

module.exports = model('Users', UserSchema); 