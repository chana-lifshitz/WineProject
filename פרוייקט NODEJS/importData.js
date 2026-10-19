// // require('dotenv').config();

// // const connectDB = require('./config/db');
// // const Wine = require('./models/wine.model');

// // const data = require('./wines_data.json');

// // const importWines = async () => {
// //     try {
// //         await connectDB();

// //         await Wine.deleteMany({});

// //         await Wine.insertMany(data.wines);

// //         console.log(`Successfully imported ${data.wines.length} wines`);

// //         process.exit(0);
// //     } catch (error) {
// //         console.error('Import error:', error);
// //         process.exit(1);
// //     }
// // };

// // importWines();

// require('dotenv').config();

// const mongoose = require('mongoose');
// const connectDB = require('./config/db');
// const Wine = require('./models/wine.model');

// const data = require('./wines_data.json');

// const importWines = async () => {
//     try {
//         await connectDB();

//         console.log('Database:', mongoose.connection.name);

//         await Wine.deleteMany({});

//         await Wine.insertMany(data.wines);

//         const count = await Wine.countDocuments();

//         console.log(`Successfully imported ${count} wines`);
//         console.log('Collection:', Wine.collection.name);

//         process.exit(0);
//     } catch (error) {
//         console.error('Import error:', error);
//         process.exit(1);
//     }
// };

// importWines();


require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Wine = require('./models/wine.model');
const Customer = require('./models/customer.model');

const winesData = require('./wines_data.json');
const customersData = require('./customers_data.json');

async function importData() {
    try {
        await connectDB();

        console.log('Connected to database:', mongoose.connection.name);

        // ייבוא יינות
        await Wine.deleteMany({});
        await Wine.insertMany(winesData.wines);

        const winesCount = await Wine.countDocuments();

        console.log(`Successfully imported ${winesCount} wines`);
        console.log('Wines collection:', Wine.collection.name);

        // ייבוא לקוחות
        await Customer.insertMany(customersData.customers, {
            ordered: true
        });

        const customersCount = await Customer.countDocuments();

        console.log(`Successfully imported ${customersCount} customers`);
        console.log('Customers collection:', Customer.collection.name);

    } catch (error) {
        console.error('Import error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

importData();
