
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // משתמשים שנרשמו דרך Google לא מחזיקים סיסמה
    password: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Customer', customerSchema);
