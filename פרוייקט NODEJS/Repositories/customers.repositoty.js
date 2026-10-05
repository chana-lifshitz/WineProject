const customeredata = require('../customers_data.json').customers
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../customers_data.json');


class Customer_repository {
    constructor() {

    };

async login(email, password) {
  const client = customeredata.find(c => c.email === email);
  
  if (!client) {
    return { success: false, message: "לקוח לא קיים" };
  }

  if (client.password !== password) {
    return { success: false, message: "סיסמה שגויה" };
  }

  // return {
  //   success: true,
  //   message:ברוך הבא, ${client.name}!,
  //   isAdmin: client.isAdmin
  // };


  return {
  success: true,
  // message: ברוך הבא, ${client.name}!,
    id: client.id,
  name:client.name,
  email:client.email,
  isAdmin: client.isAdmin,
  password:client.password
};
}
async generateNewId() {
  const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const winesArray = rawDataCustomer.customers;
  const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
  return (maxId + 1).toString();
}


async addCustomer(newCustomer) {
  const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const customersArray = rawDataCustomer.customers;

  newCustomer.id = await this.generateNewId();
  newCustomer.reviews = [];
  newCustomer.totalSold = 0;

  customersArray.push(newCustomer);
  fs.writeFileSync(dataPath, JSON.stringify(rawDataCustomer, null, 2), 'utf-8');
  return newCustomer;
}

async updateCustomer(updatedCustomer) {
  console.log("updatedCustomer:",updatedCustomer.id);
  
  const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const customersArray = rawDataCustomer.customers;

  const index = customersArray.findIndex(c => c.id === updatedCustomer.id);
  if (index === -1) {
    throw new Error('לקוח לא נמצא');
  }

  // שומרים את השדות שלא משתנים, אם רוצים
  updatedCustomer.reviews = customersArray[index].reviews;
  updatedCustomer.totalSold = customersArray[index].totalSold;

  // מעדכנים את הלקוח
  customersArray[index] = updatedCustomer;

  // כותבים את הקובץ המעודכן
  fs.writeFileSync(dataPath, JSON.stringify(rawDataCustomer, null, 2), 'utf-8');
  return updatedCustomer;
}

 }
module.exports = new Customer_repository();
//     async getAllCustomers() {
//        return customeredata;
//     }

// async getCustomerByEmail(email) {
//     const customer = customeredataId.find(w => w.email === email);
//     return customer || null;
// }
// function login(email, password) {
//   const client = clientRepository.findClientByEmail(email);
  
//   if (!client) {
//     return { success: false, message: 'לקוח לא נמצא' };
//   }

//   if (client.password !== password) {
//     return { success: false, message: 'סיסמה שגויה' };
//   }

//   return { success: true, message: ברוך הבא, ${client.name}, isAdmin: client.isAdmin };
// }