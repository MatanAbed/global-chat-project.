import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
const cookie = require('cookie');
import dotenv from 'dotenv';

// ייבוא המודלים והטייפים שכתבנו
import User from '../models/User';
import Message from '../models/Message';
import { Message as ICommonMessage } from '../../common';

dotenv.config();

// 1. הרחבת הטיפוס של WebSocket כדי שנוכל לשמור עליו את ה-userId של הלקוח המחובר
interface AuthenticatedWebSocket extends WebSocket 
{
  userId?: string;
}

export const setupWebSocket = (httpServer: HttpServer): void => 
  {
  // 2. יצירת שרת ה-WebSocket והלבשתו על שרת ה-HTTP הקיים
  const wss = new WebSocketServer({ server: httpServer });

  console.log('🔌 WebSocket Server Initialized and Listening...');

  // 3. האזנה לאירוע חיבור של לקוח חדש (Connection)
  wss.on('connection', async (ws: AuthenticatedWebSocket, req) => 
  {
    try {
      // א. חילוץ ה-Token מתוך ה-Cookies של בקשת החיבור (Handshake)
      const cookieHeader = req.headers.cookie || '';
      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      if (!token) 
      {
        console.log('⚠️ WS Connection rejected: No token provided');
        ws.close(4001, 'Unauthorized: No token provided');
        return;
      }

      // ב. אימות הטוקן וחילוץ מזהה המשתמש
      const secret = process.env.JWT_SECRET || '';
      const decoded = jwt.verify(token, secret) as { userId: string };
      
      // שמירת ה-userId על אובייקט הסוקט הספציפי של הלקוח הזה
      ws.userId = decoded.userId;

      // ג. שליפת המשתמש מהדאטאבייס כדי לוודא שהוא באמת קיים במערכת
      const user = await User.findById(ws.userId);
      if (!user) 
      {
        ws.close(4002, 'User not found');
        return;
      }

      console.log(`👤 User Connected to Chat: ${user.username}`);

      // ד. טעינת היסטוריית צ'אט (שלב 8.8) - שליפת 100 ההודעות האחרונות
      // אנחנו משתמשים ב-populate כדי להחליף את ה-sender ID באובייקט המשתמש המלא
      const history = await Message.find()
        .sort({ timestamp: -1 }) // מביא את ההודעות החדשות ביותר קודם
        .limit(100)               // מגביל ל-100 הודעות בדיוק לפי דרישת המרצה
        .populate('sender', 'username profileImage'); // שולף רק שם ותמונה של השולח

      // הפיכת המערך כדי שההודעות יוצגו בסדר כרונולוגי נכון (מהישן לחדש)
      const chronologicalHistory = history.reverse();

      // שליחת ההיסטוריה רק ללקוח שזה עתה התחבר
      ws.send(JSON.stringify({ event: 'loadHistory', data: chronologicalHistory }));

      // ה. האזנה להודעות חדשות שמגיעות מהלקוח הזה (Message Event)
      ws.on('message', async (rawMessage: string) => 
      {
        try {
          // המרת ההודעה הגולמית מ-JSON לאובייקט
          const parsedData = JSON.parse(rawMessage);
          const { content } = parsedData;

          if (!content || content.trim() === '') return;

          // יצירת מסמך הודעה חדש ושמירתו ב-MongoDB Atlas
          const newMessage = new Message({
            sender: ws.userId,
            content: content
          });
          await newMessage.save();

          // השלמת פרטי השולח (Populate) לצורך השידור לכלל המשתמשים
          const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'username profileImage');

          if (!populatedMessage) return;

          // בניית אובייקט ההודעה הסופי התואם ל-Interface המשותף שכתבנו ב-common.ts
          const messageToSend: ICommonMessage = 
          {
            _id: populatedMessage._id.toString(),
            content: populatedMessage.content,
            timestamp: populatedMessage.timestamp,
            sender: 
            {
              _id: (populatedMessage.sender as any)._id.toString(),
              username: (populatedMessage.sender as any).username,
              profileImage: (populatedMessage.sender as any).profileImage
            }
          };

          // ו. ביצוע Broadcast - שליחת ההודעה בזמן אמת לכל הלקוחות שמחוברים כרגע
          wss.clients.forEach((client) => 
          {
            if (client.readyState === WebSocket.OPEN) 
            {
              client.send(JSON.stringify({ event: 'newMessage', data: messageToSend }));
            }
          });

        } 
        catch (msgErr) 
        {
          console.error('Error processing message event:', msgErr);
          ws.send(JSON.stringify({ event: 'error', data: 'Failed to process message' }));
        }
      });

      // ז. טיפול בהתנתקות משתמש
      ws.on('close', () => 
      {
        console.log(`🔌 User Disconnected: ${user.username}`);
      });

    } 
    catch (connErr) 
    {
      console.error('Authentication failed on WS Connection:', connErr);
      ws.close(4003, 'Invalid token');
    }
  });
};