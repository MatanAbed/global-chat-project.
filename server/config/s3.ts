import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';


dotenv.config();


const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;


if (!region || !accessKeyId || !secretAccessKey) 
{
  console.error('Error: AWS credentials or region are missing in .env file');
}


const s3Client = new S3Client
({
  region: region || 'us-east-1', 
  credentials: 
  {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

export default s3Client;