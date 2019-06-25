var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Location = new Schema({
        customer_id: {
            type: String,
            required: true,
        },
        group_id: {
            type: String,
            required: true,
        },
        customer_name: {
            type: String,
            default: "",
        },
        lat: {
            type: String,
            required: true,
        },
        lng: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            default: "",
        },
        neighborhood: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        sealed: {
            type: String,
            default: false,
        },
        created: {
            type: Date,
            default: Date.now,
        },
    });

module.exports = mongoose.model('Location', Location);
