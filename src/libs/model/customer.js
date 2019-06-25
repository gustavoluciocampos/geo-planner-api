var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Client = new Schema({
        code: {
            type: String
        },
        name: {
            type: String
        },
        adress: {
            type: String
        },
        distrite: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        type: {
            type: String
        },
        businessUnit: {
            type: String
        },
        georeferenced: {
            type: String
        },
        sealedPDV: {
            type: String
        },
        status: {
            type: String
        },
        status: {
            type: String
        },
        status: {
            type: String
        },
        active: {
            type: String
        },
    });

module.exports = mongoose.model('Client', Client);
