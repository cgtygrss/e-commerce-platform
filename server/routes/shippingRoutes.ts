import express, { Request, Response, Router } from 'express';
import shipinkService from '../services/shipinkService';
import Order, { IShippingAddress } from '../models/Order';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router: Router = express.Router();

interface CreateShipmentBody {
  rateId: string;
  carrier: string;
  service?: string;
}

interface ShippingAddressData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  district?: string;
}

interface ShipmentData {
  orderId: string;
  rateId: string;
  carrier: string;
  service: string;
  addressTo: ShippingAddressData;
  addressFrom?: Partial<ShippingAddressData>;
  reference?: string;
}

interface OrderData {
  orderId: string;
  shippingAddress: IShippingAddress & { phone?: string; district?: string };
  email: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    product?: string;
  }>;
  totalPrice: number;
  paymentMethod: string;
  notes?: string;
}

// ==================== USER ROUTES ====================

/**
 * @route   GET /shipping/track/:orderId
 * @desc    Get tracking info for an order
 * @access  Private
 */
router.get('/track/:orderId', protect, async (req: AuthRequest<{ orderId: string }>, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user!._id
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
      return;
    }

    if (!order.shipinkOrderId) {
      res.status(400).json({
        success: false,
        message: 'Bu sipariş için kargo bilgisi bulunamadı'
      });
      return;
    }

    // Get order info from Shipink
    const shipinkOrder = await shipinkService.getOrder(order.shipinkOrderId);

    // Get shipment info if available
    let shipmentInfo = null;
    if (order.shipinkShipmentId) {
      shipmentInfo = await shipinkService.getShipment(order.shipinkShipmentId);
    }

    res.json({
      success: true,
      data: {
        order: {
          id: order._id,
          status: order.status,
          trackingNumber: order.trackingNumber
        },
        shipink: shipinkOrder.data,
        shipment: shipmentInfo?.data || null
      }
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo takip bilgisi alınırken hata oluştu'
    });
  }
});

// ==================== ADMIN ROUTES ====================

/**
 * @route   POST /shipping/create-order/:orderId
 * @desc    Create Shipink order for a local order
 * @access  Admin
 */
router.post('/create-order/:orderId', protect, async (req: AuthRequest<{ orderId: string }>, res: Response): Promise<void> => {
  try {
    if (!req.user!.isAdmin) {
      res.status(403).json({ success: false, message: 'Yetkiniz yok' });
      return;
    }

    const order = await Order.findById(req.params.orderId).populate('user', 'email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
      return;
    }

    if (order.shipinkOrderId) {
      res.status(400).json({
        success: false,
        message: 'Bu sipariş için zaten Shipink kaydı oluşturulmuş'
      });
      return;
    }

    const userEmail = (order.user as { email?: string })?.email || '';

    // Create order in Shipink
    const shipinkResponse = await shipinkService.createOrder({
      orderId: order._id.toString(),
      shippingAddress: order.shippingAddress,
      email: userEmail,
      items: order.orderItems,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      notes: ''
    });

    // Update local order with Shipink ID
    order.shipinkOrderId = shipinkResponse.data.id;
    order.status = 'processing';
    await order.save();

    res.json({
      success: true,
      message: 'Shipink siparişi oluşturuldu',
      data: shipinkResponse.data
    });
  } catch (error) {
    console.error('Create Shipink order error:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Shipink siparişi oluşturulurken hata oluştu'
    });
  }
});

/**
 * @route   GET /shipping/rates/:orderId
 * @desc    Get available shipping rates for an order
 * @access  Admin
 */
router.get('/rates/:orderId', protect, async (req: AuthRequest<{ orderId: string }>, res: Response): Promise<void> => {
  try {
    if (!req.user!.isAdmin) {
      res.status(403).json({ success: false, message: 'Yetkiniz yok' });
      return;
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
      return;
    }

    if (!order.shipinkOrderId) {
      res.status(400).json({
        success: false,
        message: 'Önce Shipink siparişi oluşturulmalı'
      });
      return;
    }

    const rates = await shipinkService.getRates(order.shipinkOrderId, {
      currency: ((req.query as { currency?: string }).currency) || 'TRY'
    });

    res.json({
      success: true,
      data: rates.data
    });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo fiyatları alınırken hata oluştu'
    });
  }
});

/**
 * @route   POST /shipping/create-shipment/:orderId
 * @desc    Create shipment and get tracking number
 * @access  Admin
 */
router.post('/create-shipment/:orderId', protect, async (req: AuthRequest<{ orderId: string }, {}, CreateShipmentBody>, res: Response): Promise<void> => {
  try {
    if (!req.user!.isAdmin) {
      res.status(403).json({ success: false, message: 'Yetkiniz yok' });
      return;
    }

    const { rateId, carrier, service } = req.body;
    const order = await Order.findById(req.params.orderId).populate('user', 'email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
      return;
    }

    if (!order.shipinkOrderId) {
      res.status(400).json({
        success: false,
        message: 'Önce Shipink siparişi oluşturulmalı'
      });
      return;
    }

    const userEmail = (order.user as { email?: string })?.email || '';

    // Create shipment in Shipink
    const shipmentResponse = await shipinkService.createShipment({
      orderId: order.shipinkOrderId,
      rateId,
      carrier,
      service: service || 'standard',
      addressTo: {
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        phone: order.shippingAddress.phone || '',
        email: userEmail,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country || 'TR'
      },
      reference: order._id.toString()
    });

    // Update local order with shipment info
    order.shipinkShipmentId = shipmentResponse.data.id;
    order.trackingNumber = shipmentResponse.data.tracking_number;
    order.trackingUrl = shipmentResponse.data.tracking_url;
    order.carrier = carrier;
    order.status = 'shipped';
    await order.save();

    res.json({
      success: true,
      message: 'Kargo oluşturuldu',
      data: {
        shipmentId: shipmentResponse.data.id,
        trackingNumber: shipmentResponse.data.tracking_number,
        trackingUrl: shipmentResponse.data.tracking_url,
        carrier: carrier
      }
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Kargo oluşturulurken hata oluştu'
    });
  }
});

/**
 * @route   GET /shipping/shipments
 * @desc    Get all shipments from Shipink
 * @access  Admin
 */
router.get('/shipments', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user!.isAdmin) {
      res.status(403).json({ success: false, message: 'Yetkiniz yok' });
      return;
    }

    const shipments = await shipinkService.getAllShipments();

    res.json({
      success: true,
      data: shipments.data
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargolar alınırken hata oluştu'
    });
  }
});

/**
 * @route   GET /shipping/shipment/:shipmentId
 * @desc    Get shipment details from Shipink
 * @access  Admin
 */
router.get('/shipment/:shipmentId', protect, async (req: AuthRequest<{ shipmentId: string }>, res: Response): Promise<void> => {
  try {
    if (!req.user!.isAdmin) {
      res.status(403).json({ success: false, message: 'Yetkiniz yok' });
      return;
    }

    const shipment = await shipinkService.getShipment(req.params.shipmentId);

    res.json({
      success: true,
      data: shipment.data
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo bilgisi alınırken hata oluştu'
    });
  }
});

/**
 * @route   DELETE /shipping/cancel/:orderId
 * @desc    Cancel Shipink order
 * @access  Admin
 */
router.delete('/cancel/:orderId', protect, async (req: AuthRequest<{ orderId: string }>, res: Response): Promise<void> => {
  try {
    if (!req.user!.isAdmin) {
      res.status(403).json({ success: false, message: 'Yetkiniz yok' });
      return;
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
      return;
    }

    if (!order.shipinkOrderId) {
      res.status(400).json({
        success: false,
        message: 'Bu sipariş için Shipink kaydı bulunamadı'
      });
      return;
    }

    // Delete from Shipink
    await shipinkService.deleteOrder(order.shipinkOrderId);

    // Update local order
    order.shipinkOrderId = undefined;
    order.shipinkShipmentId = undefined;
    order.trackingNumber = undefined;
    order.trackingUrl = undefined;
    order.carrier = undefined;
    await order.save();

    res.json({
      success: true,
      message: 'Shipink siparişi iptal edildi'
    });
  } catch (error) {
    console.error('Cancel shipment error:', error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || 'Kargo iptal edilirken hata oluştu'
    });
  }
});

export default router;
