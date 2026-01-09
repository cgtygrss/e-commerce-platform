const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// PayTR Configuration
const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID;
const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY;
const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT;
const TEST_MODE = process.env.PAYTR_TEST_MODE || '1';

// Generate PayTR iframe token
router.post('/create-payment', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            totalPrice,
            userBasket // Array of cart items for PayTR
        } = req.body;

        const user = req.user;

        // Generate unique merchant order ID
        const merchant_oid = `LAL${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // User information
        const email = user.email;
        const user_name = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
        const user_address = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
        const user_phone = shippingAddress.phone || '05001234567';

        // Payment amount in kuruş (1 TL = 100 kuruş)
        const payment_amount = Math.round(totalPrice * 100);

        // User IP
        const user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1';

        // Basket items for PayTR (base64 encoded JSON)
        const basket = userBasket.map(item => [
            item.name,
            (item.price * 100).toFixed(0), // Price in kuruş
            item.qty
        ]);
        const user_basket = Buffer.from(JSON.stringify(basket)).toString('base64');

        // No installment option
        const no_installment = '0';
        const max_installment = '12';

        // Currency (TL)
        const currency = 'TL';

        // Timeout limit (30 minutes)
        const timeout_limit = '30';

        // Debug mode
        const debug_on = TEST_MODE === '1' ? '1' : '0';

        // Language
        const lang = 'tr';

        // Callback URLs
        const merchant_ok_url = `${req.headers.origin || 'http://localhost:5174'}/order-success`;
        const merchant_fail_url = `${req.headers.origin || 'http://localhost:5174'}/checkout?payment=failed`;

        // Create hash string
        const hash_str = `${MERCHANT_ID}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${TEST_MODE}`;
        
        // Generate PayTR token
        const paytr_token = crypto
            .createHmac('sha256', MERCHANT_KEY)
            .update(hash_str + MERCHANT_SALT)
            .digest('base64');

        // Prepare POST data for PayTR
        const postData = {
            merchant_id: MERCHANT_ID,
            user_ip,
            merchant_oid,
            email,
            payment_amount: payment_amount.toString(),
            paytr_token,
            user_basket,
            debug_on,
            no_installment,
            max_installment,
            user_name,
            user_address,
            user_phone,
            merchant_ok_url,
            merchant_fail_url,
            timeout_limit,
            currency,
            test_mode: TEST_MODE,
            lang
        };

        // Make request to PayTR API to get iframe token
        const fetch = (await import('node-fetch')).default;
        const params = new URLSearchParams(postData);
        
        const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Store order info temporarily (will be confirmed on callback)
            // We'll create the order when we receive the callback
            
            res.json({
                success: true,
                token: result.token,
                merchant_oid,
                iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`
            });
        } else {
            console.error('PayTR Error:', result);
            res.status(400).json({
                success: false,
                message: result.reason || 'Ödeme başlatılamadı'
            });
        }
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Ödeme işlemi başlatılırken bir hata oluştu'
        });
    }
});

// PayTR callback (POST from PayTR servers)
router.post('/callback', async (req, res) => {
    try {
        const {
            merchant_oid,
            status,
            total_amount,
            hash,
            failed_reason_code,
            failed_reason_msg,
            test_mode,
            payment_type,
            currency,
            payment_amount
        } = req.body;

        // Verify hash
        const hash_str = `${merchant_oid}${MERCHANT_SALT}${status}${total_amount}`;
        const calculated_hash = crypto
            .createHmac('sha256', MERCHANT_KEY)
            .update(hash_str)
            .digest('base64');

        if (hash !== calculated_hash) {
            console.error('Hash verification failed');
            return res.send('PAYTR notification received - Hash mismatch');
        }

        if (status === 'success') {
            // Payment successful - update order
            // Find order by merchant_oid and update
            const order = await Order.findOne({ 'paymentResult.id': merchant_oid });
            
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: merchant_oid,
                    status: 'success',
                    update_time: new Date().toISOString(),
                    payment_type,
                    currency
                };
                await order.save();
            }
            
            console.log(`Payment successful for order: ${merchant_oid}`);
        } else {
            // Payment failed
            console.log(`Payment failed for order: ${merchant_oid}. Reason: ${failed_reason_msg}`);
        }

        // PayTR expects "OK" response
        res.send('OK');
    } catch (error) {
        console.error('Callback error:', error);
        res.send('OK'); // Always respond OK to PayTR
    }
});

// Create order after payment initiated
router.post('/create-order', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            merchant_oid
        } = req.body;

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice,
            paymentResult: {
                id: merchant_oid,
                status: 'pending'
            }
        });

        const createdOrder = await order.save();

        res.status(201).json({
            success: true,
            order: createdOrder
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Sipariş oluşturulurken bir hata oluştu'
        });
    }
});

// Check payment status
router.get('/status/:merchant_oid', protect, async (req, res) => {
    try {
        const { merchant_oid } = req.params;
        
        const order = await Order.findOne({ 
            'paymentResult.id': merchant_oid,
            user: req.user._id 
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş bulunamadı'
            });
        }

        res.json({
            success: true,
            isPaid: order.isPaid,
            order
        });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: 'Durum kontrolü yapılırken bir hata oluştu'
        });
    }
});

module.exports = router;
