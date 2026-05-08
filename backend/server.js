import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import brandingRouter from "./routes/brandingRoute.js";
import discountRouter from "./routes/discountRoute.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import contactRouter from "./routes/contactRoute.js";
import sunglassesRouter from "./routes/sunglassesRoute.js";
import reviewRouter from "./routes/reviewRoutes.js";

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())
app.use(cors())
app.use('/models', express.static('uploads/models'))

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product', productRouter)
app.use('/api/product', (req, res, next) => { req.query.type = 'product'; next(); }, reviewRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/branding',brandingRouter)
app.use('/api/discount',discountRouter)
app.use('/api/elite', subscribeRouter)
app.use('/api/contact', contactRouter)
app.use('/api/sunglasses', sunglassesRouter)
app.use('/api/sunglasses', (req, res, next) => { req.query.type = 'sunglasses'; next(); }, reviewRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>console.log('Server start on Port :'+ port))