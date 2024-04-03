const express = require('express');
const Router = express.Router();
const Product = require('../schema/product');
const { getSlug } = require('./utilities');
const verification = require('./verification');
const upload = require('./upload');

Router.post('/addProduct', verification, upload.single('image'), async function (req, res) {
    try {
        const { category, name, description } = req.body
        const formData = {
            category: category ? category : null,
            name: name ? name : '',
            slug: name ? getSlug(name) : '',
            description: description ? description : '',
            image: (req.file && req.file.path) ? req.file.path : '',
            status: 1,
        }
        const existData = await Product.findOne({ slug: formData.slug });
        if (existData) {
            res.status(409).json({ status: 0, message: "Product already exists" });
        } else {
            const newProduct = await Product.create(formData);
            res.status(201).json({ status: 1, data: newProduct, message: "Product created successfully" });
        }
    } catch (error) {
        res.status(400).json({ status: 0, message: "Internal server error" });
    }
})

Router.get('/listProduct', verification, async function (req, res) {
    try {
        const categories = await Product.find();
        res.status(200).json({ status: 1, data: categories });
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
})

Router.get('/viewProduct/:id', verification, async function (req, res) {
    const Id = req.params.id;
    try {
        const product = await Product.findOne({ _id: Id });
        if (product) {
            res.status(200).json({ status: 1, data: product });
        } else {
            return res.status(404).json({ status: 0, message: "Product can't be found" });
        }
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
})

Router.post('/updateProduct/:id', verification, upload.single('image'), async (req, res) => {
    const Id = req.params.id;
    try {
        const { name, description, category } = req.body
        const formData = {
            category: category ? category : null,
            name: name ? name : '',
            slug: name ? getSlug(name) : '',
            description: description ? description : '',
            image: (req.file && req.file.path) ? req.file.path : req.body.image,
        }
        const existData = await Product.findOne({ slug: formData.slug, _id: { $ne: Id } });
        if (existData) {
            res.status(409).json({ status: 0, message: "Product already exists" });
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(Id, formData, { new: true });
            if (updatedProduct) {
                res.status(200).json({ status: 1, data: updatedProduct, message: "Product updated successfully" });
            } else {
                return res.status(404).json({ status: 0, message: "Product can't be update" });
            }
        }
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
});

Router.get('/deleteProduct/:id', verification, async (req, res) => {
    const Id = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(Id);
        if (deletedProduct) {
            res.status(200).json({ status: 1, data: deletedProduct, message: "Product deleted successfully" });
        } else {
            return res.status(404).json({ status: 0, message: "Product can't be deleted" });
        }
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
});

module.exports = Router;
