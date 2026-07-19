```python
# Creating the README.md file matching the exact structure requested by the user, tailored to the global chat project.

readme_content = """# 💬 פרויקט סיום סמסטר ב' - צד שרת (Backend) למערכת צ'אט גלובלית בזמן אמת

👤 פרטי הסטודנט

* **שם:** מתן
* **מסלול:** הנדסת תוכנה - שנה ב'
* **סוג הפרויקט:** שרת WebSocket ו-RESTful API לצ'אט קבוצתי מאובטח

🚀 סקירה כללית

הפרויקט הינו מערכת Backend מלאה לצ'אט גלובלי בזמן אמת (Real-Time Chat Application), שנבנתה באמצעות Node.js, סביבת TypeScript, מסגרת Express ומסד נתונים MongoDB. המערכת תומכת בחיבורי סוקטים טהורים, ניהול משתמשים מלא, ואחסון מדיה בענן.

תכונות עיקריות במערכת:
* **אימות משתמשים (Authentication):** תהליך הרשמה והתחברות מאובטח לחלוטין המבוסס על JSON Web Token (JWT) המשולב בתוך HTTP-Only Cookies להגנה מקסימלית מפני התקפות XSS.
* **אחסון ענן (Cloud Storage):** העלאת תמונות פרופיל של משתמשים בזמן ההרשמה ישירות לשרתי AWS S3 באמצעות מודול Multer.
* **תקשורת בזמן אמת (WebSockets):** ניהול חיבורי סוקטים באמצעות ספריית `ws` הסטנדרטית, תוך ביצוע אימות משתמש קפדני כבר בשלב ה-Handshake על בסיס העוגיות שנשלחו מהדפדפן.
* **טעינת היסטוריה אוטומטית:** שליפה מיידית של 100 ההודעות האחרונות מתוך מסד הנתונים בעת התחברות משתמש חדש, והצגתן בסדר כרונולוגי נכון.
* **שידור הודעות (Broadcast):** הפצה והזרמת הודעות נכנסות בזמן אמת לכל הלקוחות המחוברים בצורה סימולטנית.
* **קישוריות נתונים וקידוד:** שימוש ב-`populate` של Mongoose כדי להחליף את מזהה השולח בפרטיו המלאים (שם ותמונת פרופיל) לפני הפצת ההודעה.
* **שיתוף טיפוסים (Shared Types):** הגדרת קובץ `common.ts` בשורש הפרויקט המכיל את ממשק ההודעה (Interface) הרשמי, על מנת להבטיח אחידות מלאה בין צד השרת לצד הלקוח.

🛠️ טכנולוגיות בשימוש

* **שרת וסביבה:** Node.js, TypeScript (TS-Node)
* **פרוטוקול זמן אמת:** WebSockets (ספריית `ws`)
* **מסגרת עבודה (Framework):** Express.js
* **מסד נתונים:** MongoDB Atlas, Mongoose ODM
* **ניהול מדיה:** AWS S3 SDK, Multer
* **אבטחה והצפנה:** JSON Web Token (JWT), Cookie-parser, Bcrypt
* **סביבת עבודה:** Dotenv (ניהול משתני סביבה מאובטחים מחוץ לקוד)

⚙️ הוראות הרצה של הפרויקט במחשב האישי

1. **שיבוט הפרויקט (clone):** פתחו טרמינל בתיקייה הרצויה והריצו את הפקודה:

```

```text
File saved successfully to README.md

```bash
   git clone [https://github.com/MatanAbed/global-chat-project..git](https://github.com/MatanAbed/global-chat-project..git)

```

2. **התקנת ספריות (Dependencies):** היכנסו לתיקיית `server` בטרמינל והריצו את הפקודה הבאה:
```bash
cd server
npm install

```


3. **הגדרת משתני סביבה (Environment Variables):** קובץ ה-`.env` הוסר מ-GitHub מטעמי אבטחה (והוגדר ב-`.gitignore`). יש ליצור קובץ בשם `.env` בשורש הפרויקט הראשי (לצד קובץ `common.ts`) ולוודא שהמפתחות הבאים מוגדרים בו בצורה תקינה:
* `MONGO_URI` - מחרוזת החיבור המלאה ל-Cluster שלכם ב-MongoDB Atlas.
* `JWT_SECRET` - המפתח הסודי שמשמש לחתימה והצפנה של ה-JWT.
* `PORT` - הפורט עליו ירוץ השרת (לדוגמה: 3000).
* `AWS_ACCESS_KEY_ID` - מפתח גישה של AWS לצורך העלאת קבצים.
* `AWS_SECRET_ACCESS_KEY` - המפתח הסודי של AWS.
* `AWS_BUCKET_NAME` - שם ה-Bucket שלכם ב-S3.
* `AWS_REGION` - האזור הגיאוגרפי של ה-Bucket (לדוגמה: us-east-1).


4. **הרצת השרת בסביבת פיתוח:** מתוך תיקיית `server`, הריצו בטרמינל:
```bash
npm run dev

```



🧪 בדיקות ב-Postman

המערכת נבדקה באופן מקיף ומלא באמצעות תוכנת Postman בכל רכיבי ה-API והסוקטים:

* **Auth - Signup & Login:** ראוט ההרשמה מקבל FormData (כולל תמונה) ומעלה אותה לענן. ראוט ההתחברות מאמת את הסיסמה המוצפנת ומזריק עוגיית `token` מאובטחת.
* **Messages History (GET /users/messages):** שליפת מערך של 100 הודעות אחרונות, המאובטח על ידי המידלוור `isLoggedIn` שמודא קיום עוגייה תקפה.
* **WebSocket Connection (ws://localhost:3000):** פתיחת חיבור סוקט תוך העברת ה-Cookie ב-Headers. בדיקת קבלת אירוע `loadHistory` מיד עם החיבור, ושליחת הודעות בפורמט JSON הבודקת שידור חוזר (`newMessage`) לכל הלקוחות עם פרטי השולח המלאים.

📂 מבנה התיקיות בפרויקט

```text
├── server/               # תיקיית קוד השרת הראשי
│   ├── config/           # קבצי הגדרות והתחברות (Mongoose ,AWS S3)
│   ├── middleware/       # מידלוורים לאימות משתמשים (isLoggedIn) והעלאת קבצים
│   ├── models/           # מודלים של Mongoose (User.ts, Message.ts)
│   ├── routes/           # נתיבי ה-REST API (auth.ts, users.ts)
│   ├── schemas/          # סכמות ולידציה של נתוני בקשות
│   ├── sockets/          # לוגיקת שרת ה-WebSocket וניהול האירועים (chat.socket.ts)
│   ├── server.ts         # נקודת המפגש והכניסה הראשית של השרת
│   └── tsconfig.json     # קובץ קונפיגורציה של TypeScript
├── .env                  # קובץ משתני סביבה סודיים (מוסתר ומאובטח)
├── .gitignore            # הגדרת תיקיות וקבצים שאין להעלות לגיט (node_modules, .env)
└── common.ts             # קובץ ממשקים (Interfaces) משותף לשרת ולקליינט

```

"""

# Save the generated content to a file

file_path = "README.md"
with open(file_path, "w", encoding="utf-8") as file:
file.write(readme_content)

print(f"File saved successfully to {file_path}")

```
הקובץ שלך מוכן ומעוצב בדיוק לפי התבנית שביקשת, מותאם ב-100% לפרויקט הצ'אט הגלובלי שעבדנו עליו! 

Your Markdown file is ready
[file-tag: code-generated-file-0-1784475139039186219]

דאגתי לכלול בו את כל הטכנולוגיות שהשתמשנו בהן (TypeScript, WebSockets, S3, Mongoose), את מבנה התיקיות העדכני עם ה-`common.ts` בחוץ, והוראות הרצה ברורות למרצה שמסבירות גם על יצירת משתני הסביבה באופן ידני בגלל ששמרנו על אבטחה בגיט.

אם תרצה לשנות פסיק או מילה – רק תגיד! שיהיה המון בהצלחה בהגשה של פרויקט סיום סמסטר ב'! 🚀

```