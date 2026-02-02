import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReturnItem {
  product: Types.ObjectId;
  name: string;
  qty: number;
  price: number;
  image?: string;
}

export interface IReturnRequest extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  items: IReturnItem[];
  reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'size_issue' | 'quality_issue' | 'arrived_late' | 'other';
  reasonDetails: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled';
  refundAmount: number;
  adminNotes: string;
  images: string[];
  trackingNumber: string;
  returnAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const returnRequestSchema = new Schema<IReturnRequest>({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String }
  }],
  reason: {
    type: String,
    required: true,
    enum: [
      'defective',
      'wrong_item',
      'not_as_described',
      'changed_mind',
      'size_issue',
      'quality_issue',
      'arrived_late',
      'other'
    ]
  },
  reasonDetails: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'refunded', 'cancelled'],
    default: 'pending'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  adminNotes: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  trackingNumber: {
    type: String,
    default: ''
  },
  returnAddress: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model<IReturnRequest>('ReturnRequest', returnRequestSchema);