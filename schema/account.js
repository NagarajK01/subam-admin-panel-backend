const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profile: String,
}, { timestamps: true, versionKey: false });

const Account = mongoose.model('settings', accountSchema);

module.exports = Account;