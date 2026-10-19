const express = require('express');
const router = express.Router();
const customerService = require('../Servises/customers.service');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);
// const fs = require('fs');
// const path = require('path');
// const data = path.join(__dirname, '../customers_data.json');
const customerRepository = require('../Repositories/customers.repositoty');
// const customerService = new CustomerService();
// למשל בתוך customers.routes.js

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const result = await customerService.login(email, password);
//   res.json(result); // תמיד מחזיר אובייקט עם success ו-message
// });

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await customerService.login(email, password);

        if (!result.success) {
            return res.status(401).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error('שגיאה בהתחברות:', error);

        return res.status(500).json({
            success: false,
            message: 'אירעה שגיאה בהתחברות'
        });
    }
});

// router.post('/signUp', async (req, res) => {
//    try {
//     console.log('dataPath =', data); // זה צריך להדפיס נתיב כמו C:\Users\... וכו'

//     const rawDataCustommer = JSON.parse(fs.readFileSync(data, 'utf-8'));
//     const customerArray = rawDataCustommer.customers;

//     const newCustomer = {
//       id: await customerRepository.generateNewId(),
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       isAdmin: false
//     };

//     customerArray.push(newCustomer);
//     fs.writeFileSync(data, JSON.stringify(rawDataCustommer, null, 2), 'utf-8');
//     res.json(newCustomer);
//   } catch (err) {
//   console.error("שגיאה:", err); // נוסיף הדפסת שגיאה
//   res.status(500).json({ error: 'שגיאה בשמירת לקוח חדש'});
// }
// });

router.post('/signUp', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'יש למלא שם, אימייל וסיסמה'
            });
        }

        const newCustomer = await customerRepository.addCustomer({
            name,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            data: newCustomer
        });
    } catch (err) {
        console.error('שגיאה בהרשמה:', err.message);

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'כתובת האימייל כבר קיימת במערכת'
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message || 'שגיאה בשמירת לקוח חדש'
        });
    }
});

// עדכון לקוח לפי ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    // נוודא שה-id שהגיע ב-params תואם למה שהולך להתעדכן
    updatedData.id = id;

    const updatedCustomer = await customerService.update(updatedData);
    res.status(200).json({
      success: true,
      message: 'הלקוח עודכן בהצלחה',
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון הלקוח',
      error: error.message,
    });
  }
});

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'חסר Google credential'
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const { sub, email, name, email_verified } = payload;

        if (!email || !email_verified) {
            return res.status(401).json({
                success: false,
                message: 'חשבון Google לא אומת'
            });
        }

        // בשלב הזה האימות הצליח.
        // צריך למצוא או ליצור לקוח באמצעות ה־Repository.
        return res.status(200).json({
            success: true,
            message: 'Google authentication verified',
            data: {
                googleId: sub,
                email,
                name
            }
        });
    } catch (error) {
        console.error('Google authentication error:', error.message);

        return res.status(401).json({
            success: false,
            message: 'האימות באמצעות Google נכשל'
        });
    }
});
module.exports = router;