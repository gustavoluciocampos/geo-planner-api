var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    DistanceMatrix = new Schema({
        group_id: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        d: {
            type: Object,
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        },
    });

module.exports = mongoose.model('DistanceMatrix', DistanceMatrix);
