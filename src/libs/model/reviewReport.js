var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    reviewReport = new Schema({
        group_id: {
            type: String,
            required: true,
        },
        deliveries: {
            type: Array,
            required: true,
        },
        volume_acm: {
            type: Number,
            default: 0,
        },
        volume_acm_in_route: {
            type: Number,
            default: 0,
        },
        volume_acm_off_route: {
            type: Number,
            default: 0,
        },
        cases_acm: {
            type: Number,
            default: 0,
        },
        cases_acm_in_route: {
            type: Number,
            default: 0,
        },
        cases_acm_off_route: {
            type: Number,
            default: 0,
        },
        customer_count: {
            type: Number,
            default: 0,
        },
        customer_count_in_route: {
            type: Number,
            default: 0,
        },
        customer_count_off_route: {
            type: Number,
            default: 0,
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

module.exports = mongoose.model('reviewReport', reviewReport);
