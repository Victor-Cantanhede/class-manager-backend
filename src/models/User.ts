import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import generateRegistration from '../functions/generateRegistration';

// Interface para o usuário
export interface IUser extends Document {
  registration: string;
  name: string;
  email: string;
  tel: number;
  userProfile: string;
  userName: string;
  password: string;
}

// Esquema do usuário
const UserSchema: Schema = new Schema(
  {
    registration: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    tel: {
      type: Number,
      required: true,
      unique: true
    },
    userProfile: {
      type: String,
      default: 'teacher'
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

// Middleware: Criptografa a senha antes de salvar
UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
  }
  next();
});

// Middleware: Gera matrícula sequencial
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.registration) {
    const result = await generateRegistration();
  if ('registration' in result) {
    this.registration = result.registration;
  }
  }
  next();
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;