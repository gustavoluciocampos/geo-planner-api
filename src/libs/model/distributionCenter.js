var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    DistributionCenter = new Schema({
        group_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            default: "",
        },
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
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
        state: {
            type: String,
            default: "",
        },
        case_unit: {
            type: Number,
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        },
        last_modified: {
            type: Date,
            default: Date.now,
        },
    });

module.exports = mongoose.model('DistributionCenter', DistributionCenter);
