var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
    name: String,
    slug: String,
    description: String,
    image: String,
    status: Boolean,
}, { timestamps: true, versionKey: false });

const Product = mongoose.model('products', productSchema);

module.exports = Product;