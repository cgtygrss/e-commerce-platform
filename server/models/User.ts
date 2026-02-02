import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  birthDate: Date | null;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  surname: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  birthDate: { type: Date, default: null },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);