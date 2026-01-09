const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
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
        type: String // URLs to uploaded images showing the issue
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

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
