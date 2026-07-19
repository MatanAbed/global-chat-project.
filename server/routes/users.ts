import { Router, Request, Response } from 'express';
import User from '../models/User';
import isLoggedIn from '../middleware/isLoggedIn';

const router = Router();


// נתיב שליפת כל המשתמשים: GET /users
// אנחנו שמים את isLoggedIn באמצע כדי לוודא שרק משתמש מחובר עם טוקן תקין יכול לגשת למידע זה
router.get('/', isLoggedIn, async (req: Request, res: Response): Promise<void> => 
  {
  try {
    // שליפת כל המשתמשים מתוך MongoDB Atlas
    // הסימן מינוס לפני passwordHash אומר למונגוס: "תביא את כל השדות חוץ מהשדה של הסיסמה"
    const users = await User.find({}).select('-passwordHash');

    // החזרת רשימת המשתמשים עם סטטוס 200 (OK)
    res.status(200).json(users);
  } 
  catch (error) 
  {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 7.2 מחזיר 100 הודעות אחרונות עם populate
router.get('/messages', isLoggedIn, async (req, res): Promise<void> => 
  {
  try {
    // ייבוא בטוח יותר למודל ב-TypeScript
    const MessageModule = require('../models/Message');
    const Message = MessageModule.default || MessageModule;

    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('sender', 'username profileImage');
    
    res.status(200).json(messages.reverse());
  } 
  catch (error: any) 
  {
    console.error("Error in GET /messages:", error); // השורה שתדפיס לנו לטרמינל!
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
});

export default router;