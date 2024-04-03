const express = require('express');
const Router = express.Router();
const Category = require('../schema/category');
const { getSlug } = require('./utilities');
const verification = require('./verification');
const upload = require('./upload');
const Product = require('../schema/product');

Router.post('/addCategory', verification, upload.single('image'), async function (req, res) {
    try {
        console.log("req.body", req.body);
        console.log("req.file", req.file);
        const { name, description } = req.body
        const formData = {
            name: name ? name : '',
            slug: name ? getSlug(name) : '',
            description: description ? description : '',
            image: (req.file && req.file.path) ? req.file.path : '',
            status: 1,
        }
        const existData = await Category.findOne({ slug: formData.slug });
        if (existData) {
            res.status(409).json({ status: 0, message: "Category already exists" });
        } else {
            const newCategory = await Category.create(formData);
            res.status(201).json({ status: 1, data: newCategory, message: "Category created successfully" });
        }
    } catch (error) {
        res.status(400).json({ status: 0, message: "Internal server error" });
    }
})

Router.get('/listCategory', verification, async function (req, res) {
    try {
        const categories = await Category.find();
        res.status(200).json({ status: 1, data: categories });
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
})

Router.get('/viewCategory/:id', verification, async function (req, res) {
    const Id = req.params.id;
    try {
        const category = await Category.findOne({ _id: Id });
        if (category) {
            res.status(200).json({ status: 1, data: category });
        } else {
            return res.status(404).json({ status: 0, message: "Category can't be found" });
        }
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
})

Router.post('/updateCategory/:id', verification, upload.single('image'), async (req, res) => {
    const Id = req.params.id;
    try {
        const { name, description } = req.body
        const formData = {
            name: name ? name : '',
            slug: name ? getSlug(name) : '',
            description: description ? description : '',
            image: (req.file && req.file.path) ? req.file.path : req.body.image,
        }
        const existData = await Category.findOne({ slug: formData.slug, _id: { $ne: Id } });
        if (existData) {
            res.status(409).json({ status: 0, message: "Category already exists" });
        } else {
            const updatedCategory = await Category.findByIdAndUpdate(Id, formData, { new: true });
            if (updatedCategory) {
                res.status(200).json({ status: 1, data: updatedCategory, message: "Category updated successfully" });
            } else {
                return res.status(404).json({ status: 0, message: "Category can't be update" });
            }
        }
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });

    }
});

Router.get('/deleteCategory/:id', verification, async (req, res) => {
    const Id = req.params.id;
    try {
        const existProduct = await Product.findOne({ category: Id });
        if (existProduct) {
            return res.status(404).json({ status: 0, message: "If you can't delete this data because,this is currently connected with Products" });
        } else {
            const deletedCategory = await Category.findByIdAndDelete(Id);
            if (deletedCategory) {
                res.status(200).json({ status: 1, data: deletedCategory, message: "Category deleted successfully" });
            } else {
                return res.status(404).json({ status: 0, message: "Category can't be deleted" });
            }
        }

    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });
    }
});

Router.post('/changeStatus/:id', async (req, res) => {
    const Id = req.params.id;
    const status = req.body.status;
    if (Id) {
        const updatedCategory = await Category.findByIdAndUpdate(Id, { status: status }, { new: true });
        if (updatedCategory) {
            res.status(200).json({ status: 1, data: updatedCategory, message: "Status updated successfully" });
        } else {
            return res.status(400).json({ status: 0, message: "Status can't be update" });
        }
    } else {
        res.status(400).json({ status: 0, message: "Internal server error" });
    }
});

module.exports = Router;
