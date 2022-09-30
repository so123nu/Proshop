import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//@desc   Create New Order
//@route  /api/orders
//@access Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress,
        paymentMethod, itemsPrice, taxPrice,
        shippingPrice, totalPrice } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error("Order Items cannot be empty!")
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            itemsPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(200).json(createdOrder)
    }
})

//@desc   Get Order By Id
//@route  /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        res.status(404)
        throw new Error("Order Not found!")
        return;
    } else {
        res.status(200).json(order)
    }
})

//@desc   Update order to paid
//@route  /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404)
        throw new Error("Order Not found!")
        return;
    } else {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder)
    }
})

//@desc   Get logged in user's order
//@route  /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        res.status(404)
        throw new Error("Order Not found!")
        return;
    } else {

        res.status(200).json(orders)
    }
})

//@desc   Get all orders
//@route  /api/orders
//@access Private/admin
const getOrders = asyncHandler(async (req, res) => {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1
    const count = await Order.countDocuments({});

    const orders = await Order.find({}).populate('user', 'id name').limit(pageSize).skip((pageSize * (page - 1)));

    if (!orders) {
        res.status(404)
        throw new Error("Order Not found!")
        return;
    } else {

        res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) })
    }
})


//@desc   Update order to delivered
//@route  /api/orders/:id/deliver
//@access Private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404)
        throw new Error("Order Not found!")
        return;
    } else {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder)
    }
})




export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }