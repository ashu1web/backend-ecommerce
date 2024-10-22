import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import cloudinary from 'cloudinary'
import Stripe from 'stripe'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'



// dot env config
dotenv.config()

//databbse connection
connectDB();

//stripe configuration
export const stripe=new Stripe(process.env.STRIPE_API_SECRET)
//rest object 
const app=express()

//cloudinary config
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

//middleware   ---jb tk middleware exceute nhi hota agge ka fucntion exceute nhi hoga
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(mongoSanitize())


//route
//routes imports
import testRoutes from './routes/testRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

app.use('/api/v1',testRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/cat',categoryRoutes)
app.use('/api/v1/order',orderRoutes)
app.get('/',(req,res)=>{
    return res.status(200).send("<h1>Welcome to node server E-commerce-app</h1>")
});                                                             //http://localhost:8080


//port
const PORT=process.env.PORT || 8080;

//listen
app.listen(PORT,()=>{
    console.log(`Server Running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} Mode`)
})

//how it works
/*
The res (response) object in your backend code is automatically provided by Express.js, the Node.js framework you're using. It’s part of the request-response cycle in web servers.

Here's how it works:

When a client (like Postman) sends a request to your server, Express creates two objects: the req (request) object and the res (response) object.
req holds all the information coming from the client (like request data, headers, etc.).
res is what you use to send a response back to the client. You can send back JSON, HTML, or even an error message using this object.
Even though you don't have frontend code, tools like Postman simulate requests to your backend, and you use the res object to send responses back to Postman or any client.
   
*/