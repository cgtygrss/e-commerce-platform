const express = require('express');
const router = express.Router();
const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all return requests for user
router.get('/my-returns', protect, async (req, res) => {
    try {
        const returns = await ReturnRequest.find({ user: req.user._id })
            .populate('order')
            .sort({ createdAt: -1 });
        
        res.json(returns);
    } catch (error) {
        console.error('Error fetching returns:', error);
        res.status(500).json({ message: 'İade talepleri alınırken hata oluştu' });
    }
});

// Get single return request
router.get('/:id', protect, async (req, res) => {
    try {
        const returnRequest = await ReturnRequest.findOne({ 
            _id: req.params.id,
            user: req.user._id 
        }).populate('order');
        
        if (!returnRequest) {
            return res.status(404).json({ message: 'İade talebi bulunamadı' });
        }
        
        res.json(returnRequest);
    } catch (error) {
        console.error('Error fetching return:', error);
        res.status(500).json({ message: 'İade talebi alınırken hata oluştu' });
    }
});

// Create return request
router.post('/', protect, async (req, res) => {
    try {
        const { orderId, items, reason, reasonDetails, images } = req.body;
        
        // Verify order belongs to user and is eligible for return
        const order = await Order.findOne({ 
            _id: orderId, 
            user: req.user._id 
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }
        
        if (!order.isPaid) {
            return res.status(400).json({ message: 'Ödenmemiş siparişler için iade talebi oluşturulamaz' });
        }
        
        // Check if order is within return window (14 days from delivery or payment)
        const returnWindowDays = 14;
        const referenceDate = order.deliveredAt || order.paidAt || order.createdAt;
        const daysSinceOrder = Math.floor((Date.now() - new Date(referenceDate)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceOrder > returnWindowDays) {
            return res.status(400).json({ 
                message: `İade süresi (${returnWindowDays} gün) dolmuştur` 
            });
        }
        
        // Check if return request already exists for this order
        const existingReturn = await ReturnRequest.findOne({ 
            order: orderId,
            status: { $in: ['pending', 'approved'] }
        });
        
        if (existingReturn) {
            return res.status(400).json({ 
                message: 'Bu sipariş için zaten aktif bir iade talebi mevcut' 
            });
        }
        
        // Calculate refund amount
        const refundAmount = items.reduce((total, item) => total + (item.price * item.qty), 0);
        
        const returnRequest = new ReturnRequest({
            order: orderId,
            user: req.user._id,
            items,
            reason,
            reasonDetails: reasonDetails || '',
            images: images || [],
            refundAmount,
            returnAddress: 'Lâl Takı - İade Departmanı\nİstanbul, Türkiye' // Default return address
        });
        
        await returnRequest.save();
        
        // Update order status to return_requested
        order.status = 'return_requested';
        await order.save();
        
        res.status(201).json({
            success: true,
            message: 'İade talebiniz başarıyla oluşturuldu',
            returnRequest
        });
    } catch (error) {
        console.error('Error creating return request:', error);
        res.status(500).json({ message: 'İade talebi oluşturulurken hata oluştu' });
    }
});

// Cancel return request (only if pending)
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const returnRequest = await ReturnRequest.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'pending'
        });
        
        if (!returnRequest) {
            return res.status(404).json({ message: 'İptal edilebilir iade talebi bulunamadı' });
        }
        
        returnRequest.status = 'cancelled';
        await returnRequest.save();
        
        res.json({
            success: true,
            message: 'İade talebi iptal edildi',
            returnRequest
        });
    } catch (error) {
        console.error('Error cancelling return:', error);
        res.status(500).json({ message: 'İade talebi iptal edilirken hata oluştu' });
    }
});

// Add tracking number to return
router.put('/:id/tracking', protect, async (req, res) => {
    try {
        const { trackingNumber } = req.body;
        
        const returnRequest = await ReturnRequest.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'approved'
        });
        
        if (!returnRequest) {
            return res.status(404).json({ message: 'Onaylanmış iade talebi bulunamadı' });
        }
        
        returnRequest.trackingNumber = trackingNumber;
        await returnRequest.save();
        
        res.json({
            success: true,
            message: 'Kargo takip numarası eklendi',
            returnRequest
        });
    } catch (error) {
        console.error('Error adding tracking:', error);
        res.status(500).json({ message: 'Takip numarası eklenirken hata oluştu' });
    }
});

// Admin routes

// Get all return requests (admin)
router.get('/admin/all', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Yetkiniz yok' });
        }
        
        const { status } = req.query;
        const filter = status ? { status } : {};
        
        const returns = await ReturnRequest.find(filter)
            .populate('user', 'name email')
            .populate('order')
            .sort({ createdAt: -1 });
        
        res.json(returns);
    } catch (error) {
        console.error('Error fetching all returns:', error);
        res.status(500).json({ message: 'İade talepleri alınırken hata oluştu' });
    }
});

// Update return request status (admin)
router.put('/admin/:id', protect, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Yetkiniz yok' });
        }
        
        const { status, adminNotes, refundAmount } = req.body;
        
        const returnRequest = await ReturnRequest.findById(req.params.id);
        
        if (!returnRequest) {
            return res.status(404).json({ message: 'İade talebi bulunamadı' });
        }
        
        if (status) returnRequest.status = status;
        if (adminNotes) returnRequest.adminNotes = adminNotes;
        if (refundAmount !== undefined) returnRequest.refundAmount = refundAmount;
        
        await returnRequest.save();
        
        res.json({
            success: true,
            message: 'İade talebi güncellendi',
            returnRequest
        });
    } catch (error) {
        console.error('Error updating return:', error);
        res.status(500).json({ message: 'İade talebi güncellenirken hata oluştu' });
    }
});

module.exports = router;
