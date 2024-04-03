const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    image: String,
    status: Boolean,
}, { timestamps: true, versionKey: false });

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
