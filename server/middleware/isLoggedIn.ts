import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


declare global 
{
  namespace Express 
  {
    interface Request 
    {
      user?: 
      {
        userId: string;
      };
    }
  }
}


interface JwtPayload 
{
  userId: string;
}


const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => 
{
  try {
    
    const token = req.cookies?.token;

    // אם אין טוקן בכלל, המשתמש לא מחובר - מחזירים שגיאה 401 (Unauthorized)
    if (!token) 
    {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    // אימות הטוקן באמצעות המפתח הסודי שלנו מה-.env
    const secret = process.env.JWT_SECRET;
    if (!secret) 
    {
      res.status(500).json({ message: 'Server configuration error.' });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // הצמדת ה-userId שנמצא בטוקן אל אובייקט הבקשה req
    req.user = 
    {
      userId: decoded.userId
    };

    // הכל תקין! קוראים ל-next כדי להמשיך לראוט המבוקש
    next();
  } 
  catch (error) 
  {
    // אם הטוקן פג תוקף או שונה/מזויף, האימות ייכשל ונגיע לכאן
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default isLoggedIn;