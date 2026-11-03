// כתובת השרת: ב-Render מוגדרת דרך REACT_APP_API_URL, ובמחשב ברירת המחדל היא localhost
export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
