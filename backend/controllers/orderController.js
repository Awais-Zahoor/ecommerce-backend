import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import { incrementDiscountUsages, computeDeliveryFeeForSubtotal } from './discountController.js'
import productModel from "../models/productModel.js";

// global variables
const currency = 'pkr'

// Helper to handle stock decrement
const decrementStock = async (items) => {
    try {
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (product) {
                const newQty = Math.max(0, (product.stockQuantity || 0) - item.quantity);
                await productModel.findByIdAndUpdate(item._id, { 
                    stockQuantity: newQty,
                    inStock: newQty > 0 
                });
            }
        }
    } catch (error) {
        console.error("Stock Decrement Error:", error);
    }
}

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD Method
const placeOrder = async (req, res) => {

    try {

        const { userId, items, amount, address, discountCode, discountAmount, discountType, discountId } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
            discountCode:   discountCode   || '',
            discountAmount: discountAmount || 0,
            discountType:   discountType   || '',
            discountId:     discountId     || ''
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Handle Stock
        await decrementStock(items);

        // Increment coupon usage (with userId for per-user limit tracking)
        if (discountId) await incrementDiscountUsages(discountId, userId);

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {

        const { userId, items, amount, address, discountCode, discountAmount, discountType, discountId } = req.body;
        const { origin } = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
            discountCode:   discountCode   || '',
            discountAmount: discountAmount || 0,
            discountType:   discountType   || '',
            discountId:     discountId     || ''
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) =>({
            price_data: {
                currency:currency,
                product_data:{
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        const orderSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shippingFee = await computeDeliveryFeeForSubtotal(orderSubtotal)
        if (shippingFee > 0) {
            line_items.push({
                price_data: {
                    currency:currency,
                    product_data:{
                        name:'Delivery Charges'
                    },
                    unit_amount: shippingFee * 100
                },
                quantity: 1
            })
        }

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url})


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// verify Stripe
const verifyStripe = async (req,res)=>{
    const {orderId, success, userId} = req.body

    try {
        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(orderId, {payment:true}, { new: true });
            
            // Handle Stock for Stripe
            if (order && order.items) {
                await decrementStock(order.items);
            }

            if (order?.discountId) await incrementDiscountUsages(order.discountId, userId);
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// User Order Data For Frontend
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// Update order status from Admin panel
const updateStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

export { verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }