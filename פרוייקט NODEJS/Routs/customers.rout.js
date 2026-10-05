const express = require('express');
const router = express.Router();
const customerService = require('../Servises/customers.service');
const fs = require('fs');
const path = require('path');
const data = path.join(__dirname, '../customers_data.json');
const customerRepository = require('../Repositories/customers.repositoty');
// const customerService = new CustomerService();
// למשל בתוך customers.routes.js

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await customerService.login(email, password);
  res.json(result); // תמיד מחזיר אובייקט עם success ו-message
});

router.post('/signUp', async (req, res) => {
   try {
    console.log('dataPath =', data); // זה צריך להדפיס נתיב כמו C:\Users\... וכו'

    const rawDataCustommer = JSON.parse(fs.readFileSync(data, 'utf-8'));
    const customerArray = rawDataCustommer.customers;

    const newCustomer = {
      id: await customerRepository.generateNewId(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: false
    };

    customerArray.push(newCustomer);
    fs.writeFileSync(data, JSON.stringify(rawDataCustommer, null, 2), 'utf-8');
    res.json(newCustomer);
  } catch (err) {
  console.error("שגיאה:", err); // נוסיף הדפסת שגיאה
  res.status(500).json({ error: 'שגיאה בשמירת לקוח חדש'});
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

module.exports = router;