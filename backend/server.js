import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import formRoutes from './routes/formRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import {fileURLToPath} from'url'
import path from 'path';

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json('API is running...');
})


connectDB();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/forms',formRoutes)
app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})