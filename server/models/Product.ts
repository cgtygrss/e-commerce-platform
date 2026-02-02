import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  color: string;
  material: string;
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String, default: 'Gold' },
  material: { type: String, default: 'Gold' },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', productSchema);