// const customerRepository = require('../Repositories/customers.repositoty');

// class Customer_service {
//     constructor() {
//     }
//    async login(email,password) {
//         return await customerRepository.login(email,password);
//     }
//    async signUp(name,email,password) {
//         return await customerRepository.signUp(name,email,password);
//     } 
//     async update(id,name,email,password) {
//         return await customerRepository.updateCustomer(id,name,email,password);
//     } 
// }
// module.exports = new Customer_service();


const customerRepository = require('../Repositories/customers.repositoty');

class Customer_service {
    async login(email, password) {
        return await customerRepository.login(email, password);
    }

    async signUp(name, email, password) {
        return await customerRepository.addCustomer({
            name,
            email,
            password
        });
    }

    async update(updatedCustomer) {
        return await customerRepository.updateCustomer(updatedCustomer);
    }
}

module.exports = new Customer_service();
