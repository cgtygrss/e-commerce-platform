import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  code: string;
  phoneCode: string;
  phoneFormat: string;
  phonePlaceholder: string;
  flag?: string;
  cities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new Schema<ICountry>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  phoneCode: { type: String, required: true },
  phoneFormat: { type: String, required: true },
  phonePlaceholder: { type: String, required: true },
  flag: { type: String },
  cities: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<ICountry>('Country', countrySchema);