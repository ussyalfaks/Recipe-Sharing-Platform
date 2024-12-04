import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;


const app = express();

app.use(cors());
app.use(express.json());

console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/auth', authRoutes);
app.use('/api', recipeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

