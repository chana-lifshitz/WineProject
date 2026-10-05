const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const path = require('path');
const wines = require('./Routs/wine.rout');
const customers = require('./Routs/customers.rout');

const host_name = process.env.HOST_NAME || '127.0.0.1';
const port = process.env.PORT;
app.use(cors()); // חשוב אם הלקוח בריאקט על פורט אחר
app.use(express.json()); // לפרוס JSON בבקשות POST

// כדי לשרת את התמונות מתיקיית uploads בכתובת /image/
app.use('/image', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/api/customers', customers);
app.use('/api/wines', wines);


app.use('/image', express.static(path.join(__dirname,'image')));




app.listen(port, host_name, () => {
        console.log(`server is up in address http://${host_name}:${port}`);

});
