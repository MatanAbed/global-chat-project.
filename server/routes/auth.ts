import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// ייבוא הרכיבים שכתבנו בשלבים הקודמים
import User from '../models/User';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import upload from '../middleware/upload';
import s3Client from '../config/s3';
import isLoggedIn from '../middleware/isLoggedIn';

dotenv.config();
const router = Router();

// ==========================================
// 1. נתיב הרשמה: POST /auth/signup
// ==========================================
router.post('/signup', upload.single('profileImage'), async (req: Request, res: Response): Promise<void> => {
  try {
    // א. ולידציה על גוף הבקשה באמצעות Joi
    const { error, value } = registerSchema.validate(req.body);
    if (error) 
    {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { username, email, password } = value;

    // ב. בדיקה האם האימייל כבר קיים במערכת
    const existingUser = await User.findOne({ email });
    if (existingUser) 
    {
      res.status(409).json({ message: 'Email is already registered' });
      return;
    }

    // ג. הצפנת הסיסמה באמצעות bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ד. טיפול בהעלאת תמונת הפרופיל ל-AWS S3 (אם הועלתה)
   // ד. טיפול זמני בתמונה עבור בדיקות מקומיות (עוקף את ה-S3 כדי למנוע קריסה)
    let profileImageUrl = '';
    if (req.file) 
    {
      profileImageUrl = `http://localhost:3000/public/uploads/${Date.now()}-${req.file.originalname}`;
    }

    // ה. שמירת המשתמש החדש במסד הנתונים MongoDB
    const newUser = new User
    ({
      username,
      email,
      passwordHash,
      profileImage: profileImageUrl,
    });

    await newUser.save();

    res.status(201).json
    ({
      message: 'User registered successfully!',
      user: 
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });
  } 
  catch (error) 
  {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 2. נתיב התחברות: POST /auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => 
  {
  try {
    // א. ולידציה על נתוני הקלט באמצעות Joi
    const { error, value } = loginSchema.validate(req.body);
    if (error) 
    {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = value;

    // ב. שליפת המשתמש מהדאטאבייס לפי האימייל
    const user = await User.findOne({ email });
    if (!user) 
    {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // ג. בדיקת תקינות הסיסמה מול ה-Hash המוצפן ששמור לנו
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) 
    {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // ד. הנפקת טוקן JWT למשתמש
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) 
    {
      res.status(500).json({ message: 'Server configuration error.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'superSecretFallbackKey123';
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1d' });

    // ה. יצירת תאריך תפוגה של שבוע מהיום עבור ה-Cookie
    const cookieExpiry = new Date();
    cookieExpiry.setDate(cookieExpiry.getDate() + 7);

    // ו. שליחת הטוקן בתוך httpOnly Cookie מאובטח
    res.cookie('token', token, 
    {
      httpOnly: true, // מונע ממתקפות קליינט לקרוא את הטוקן ב-JS
      expires: cookieExpiry,
      secure: process.env.NODE_ENV === 'production', // יעבוד ב-HTTPS בלבד בפרודקשן
      sameSite: 'strict',
    });

    res.status(200).json
    ({
      message: 'Login successful!',
      user: 
      {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } 
  catch (error) 
  {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 3. נתיב בדיקת משתמש מחובר: GET /auth/me
router.get('/me', isLoggedIn, async (req: Request, res: Response): Promise<void> => 
{
  try {
    // השדה req.user.userId חולץ ואומת באופן מאובטח בתוך המידלוור isLoggedIn
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    
    if (!user) 
    {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } 
  catch (error) 
  {
    console.error('Auth Me Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;