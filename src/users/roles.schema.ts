import { Schema, model } from 'mongoose';

export const RolesSchema = new Schema({
    role: String
  });

module.exports = model('Roles', RolesSchema); 