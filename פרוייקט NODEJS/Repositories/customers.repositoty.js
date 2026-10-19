// const customeredata = require('../customers_data.json').customers
// const fs = require('fs');
// const path = require('path');
// const dataPath = path.join(__dirname, '../customers_data.json');


// class Customer_repository {
//     constructor() {

//     };

// async login(email, password) {
//   const client = customeredata.find(c => c.email === email);
  
//   if (!client) {
//     return { success: false, message: "לקוח לא קיים" };
//   }

//   if (client.password !== password) {
//     return { success: false, message: "סיסמה שגויה" };
//   }

//   // return {
//   //   success: true,
//   //   message:ברוך הבא, ${client.name}!,
//   //   isAdmin: client.isAdmin
//   // };


//   return {
//   success: true,
//   // message: ברוך הבא, ${client.name}!,
//     id: client.id,
//   name:client.name,
//   email:client.email,
//   isAdmin: client.isAdmin,
//   password:client.password
// };
// }
// async generateNewId() {
//   const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//   const winesArray = rawDataCustomer.customers;
//   const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
//   return (maxId + 1).toString();
// }


// async addCustomer(newCustomer) {
//   const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//   const customersArray = rawDataCustomer.customers;

//   newCustomer.id = await this.generateNewId();
//   newCustomer.reviews = [];
//   newCustomer.totalSold = 0;

//   customersArray.push(newCustomer);
//   fs.writeFileSync(dataPath, JSON.stringify(rawDataCustomer, null, 2), 'utf-8');
//   return newCustomer;
// }

// async updateCustomer(updatedCustomer) {
//   console.log("updatedCustomer:",updatedCustomer.id);
  
//   const rawDataCustomer = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//   const customersArray = rawDataCustomer.customers;

//   const index = customersArray.findIndex(c => c.id === updatedCustomer.id);
//   if (index === -1) {
//     throw new Error('לקוח לא נמצא');
//   }

//   // שומרים את השדות שלא משתנים, אם רוצים
//   updatedCustomer.reviews = customersArray[index].reviews;
//   updatedCustomer.totalSold = customersArray[index].totalSold;

//   // מעדכנים את הלקוח
//   customersArray[index] = updatedCustomer;

//   // כותבים את הקובץ המעודכן
//   fs.writeFileSync(dataPath, JSON.stringify(rawDataCustomer, null, 2), 'utf-8');
//   return updatedCustomer;
// }

//  }
// module.exports = new Customer_repository();
// //     async getAllCustomers() {
// //        return customeredata;
// //     }

// // async getCustomerByEmail(email) {
// //     const customer = customeredataId.find(w => w.email === email);
// //     return customer || null;
// // }
// // function login(email, password) {
// //   const client = clientRepository.findClientByEmail(email);
  
// //   if (!client) {
// //     return { success: false, message: 'לקוח לא נמצא' };
// //   }

// //   if (client.password !== password) {
// //     return { success: false, message: 'סיסמה שגויה' };
// //   }

// //   return { success: true, message: ברוך הבא, ${client.name}, isAdmin: client.isAdmin };
// // }


const Customer = require('../models/customer.model');

class Customer_repository {
    async login(email, password) {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return {
                success: false,
                message: 'לקוח לא קיים'
            };
        }

        // כרגע תואם לסיסמאות הקיימות במסד הנתונים.
        // בהמשך נעביר את אימות הסיסמה ל-hash מאובטח.
        if (customer.password !== password) {
            return {
                success: false,
                message: 'סיסמה שגויה'
            };
        }

        return {
            success: true,
            id: customer.id,
            name: customer.name,
            email: customer.email,
            isAdmin: customer.isAdmin
        };
    }

    async generateNewId() {
        const customers = await Customer.find({}, { id: 1, _id: 0 });

        const maxId = customers.reduce((max, customer) => {
            return Math.max(max, parseInt(customer.id, 10) || 0);
        }, 0);

        return (maxId + 1).toString();
    }

    async addCustomer(newCustomer) {
        const existingCustomer = await Customer.findOne({
            email: newCustomer.email
        });

        if (existingCustomer) {
            throw new Error('כתובת האימייל כבר קיימת במערכת');
        }

        const customer = await Customer.create({
            id: await this.generateNewId(),
            name: newCustomer.name,
            email: newCustomer.email,
            password: newCustomer.password,
            isAdmin: false
        });

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            isAdmin: customer.isAdmin
        };
    }

    async updateCustomer(updatedCustomer) {
        const customer = await Customer.findOne({ id: updatedCustomer.id });

        if (!customer) {
            throw new Error('לקוח לא נמצא');
        }

        if (updatedCustomer.name !== undefined) {
            customer.name = updatedCustomer.name;
        }

        if (updatedCustomer.email !== undefined) {
            customer.email = updatedCustomer.email;
        }

        if (updatedCustomer.password !== undefined) {
            customer.password = updatedCustomer.password;
        }

        if (updatedCustomer.isAdmin !== undefined) {
            customer.isAdmin = updatedCustomer.isAdmin;
        }

        await customer.save();

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            isAdmin: customer.isAdmin
        };
    }
}

module.exports = new Customer_repository();
