const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        clientId: {
            type: String,
            default: ''
        },
        clientName: {
            type: String,
            default: ''
        },
        comment: {
            type: String,
            required: true
        },
        stars: {
            type: Number,
            default: undefined
        }
    },
    {
        _id: false
    }
);

const wineSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        price: {
            type: Number,
            required: true
        },
        reviews: {
            type: [reviewSchema],
            default: []
        },
        image: {
            type: String,
            default: ''
        },
        totalSold: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Wine', wineSchema);