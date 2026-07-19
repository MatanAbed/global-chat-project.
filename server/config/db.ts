import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const connectDB = async (): Promise<void> => 
{
  try {
    

const mongoURI = 'mongodb://127.0.0.1:27017/global-chat';

    await mongoose.connect(mongoURI);
    
    console.log('🍃 MongoDB Connected Successfully...');
  } 
  catch (error) 
  {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1); 
  }
};

export default connectDB;