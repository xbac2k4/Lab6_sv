const mongoose = require('mongoose');

// khai báo food
const Distributor = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
});

const DistributorModel = mongoose.model('distributor', Distributor);

module.exports = DistributorModel;