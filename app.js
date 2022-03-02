require('dotenv').config()

const connectDB=require('./db/connect')

const productsRouter=require('./routes/products')

//async errors
require('express-async-errors')

const express= require('express')
const app=express();

const notFoundHandler=require('./middleware/not-found')
const errorHandler=require('./middleware/error-handler')

app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1>Store API</h1> <a href="/api/v1/products">Products</a>')
})

//products route
app.use('/api/v1/products',productsRouter)


app.use(notFoundHandler);
app.use(errorHandler);

const port=process.env.PORT || 3000;


const start=async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log('server is listening on port 3000'))
    } catch (error) {
        console.log(error)
    }
}

start()