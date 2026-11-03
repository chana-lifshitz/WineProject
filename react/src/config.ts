// כתובת השרת:
// - אם מוגדר REACT_APP_API_URL - משתמשים בו (שרת ואתר בשירותים נפרדים)
// - ב-build (production) בלי הגדרה - כתובת יחסית, כי השרת מגיש גם את האתר
// - בפיתוח במחשב (npm start) - השרת המקומי
const fromEnv = process.env.REACT_APP_API_URL;
export const API_URL = (
  fromEnv !== undefined
    ? fromEnv
    : process.env.NODE_ENV === 'production'
      ? ''
      : 'http://localhost:5000'
).replace(/\/$/, '');
