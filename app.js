import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routesUrls from './routes/authRoutes.js';
import userImgRoutes from './routes/userImgRoutes.js';
import cors from 'cors'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"]
}))
app.use('/images', express.static('images'))
app.use('/app', routesUrls)
app.use('/user-images', userImgRoutes)

const db = process.env.DATABASE_ACCESS
const PORT = process.env.PORT

const start = () => {
    try {
        mongoose.connect(db, () => console.log('connected to DB'))
        app.listen(PORT, () => console.log("server start"))
    } catch (error) {
        console.log(error)
    }
}

start()
