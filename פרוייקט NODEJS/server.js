require('dotenv').config();
require('dotenv').config();

console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log(
    'MONGO_URI starts correctly:',
    process.env.MONGO_URI?.startsWith('mongodb')
);
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const wines = require('./Routs/wine.rout');
const customers = require('./Routs/customers.rout');
const connectDB = require('./config/db');
const sommelier = require('./Routs/sommelier.rout');
// connectDB();

// ב-Render השרת חייב להאזין על 0.0.0.0
const host_name = process.env.HOST_NAME || '0.0.0.0';
const port = process.env.PORT || 5000;
app.use(cors()); // חשוב אם הלקוח בריאקט על פורט אחר
// app.use(express.json()); // לפרוס JSON בבקשות POST

// כדי לשרת את התמונות מתיקיית uploads בכתובת /image/
app.use('/image', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/api/customers', customers);
app.use('/api/wines', wines);


app.use('/image', express.static(path.join(__dirname,'image')));

app.use('/api/sommelier', sommelier);

// הגשת אתר ה-React הבנוי (react/build), כשהשרת והאתר רצים יחד באותו שירות
const reactBuild = path.join(__dirname, '..', 'react', 'build');
if (fs.existsSync(reactBuild)) {
    app.use(express.static(reactBuild));
    // כל כתובת שאינה API או תמונה מוחזרת ל-React Router
    app.get(/^\/(?!api\/|image\/).*/, (req, res) => {
        res.sendFile(path.join(reactBuild, 'index.html'));
    });
}

// app.listen(port, host_name, () => {
//         console.log(`server is up in address http://${host_name}:${port}`);

// });
connectDB()
    .then(() => {
        app.listen(port, host_name, () => {
            console.log(
                `server is up in address http://${host_name}:${port}`
            );
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });