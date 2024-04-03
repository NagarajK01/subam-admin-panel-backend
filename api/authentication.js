const express = require('express');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const verification = require('./verification');
const Account = require('../schema/account');
const bcrypt = require('bcryptjs');
const upload = require('./upload');

Router.post('/login', async (req, res) => {
    console.log("req.body", req.body);
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ status: 0, message: "Email is required" });
    if (!password) return res.status(400).json({ status: 0, message: "Password is required" });
    try {
        const account = await Account.findOne({ email: email.toLowerCase() });
        if (!account) {
            return res.status(400).json({ status: 0, message: "Email does not exist" });
        }
        const passwordMatch = bcrypt.compareSync(password, account.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: 0, message: "Invalid password" });
        }
        const token = jwt.sign({ email: email, password: account.password }, 'product123', { expiresIn: '8h' });
        return res.status(200).json({ status: 1, token: token, message: 'Logged in successfully' });
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal server error" });
    }
});

Router.get('/accountDetail', verification, async (req, res) => {
    const { ID, email, name, profile } = req;
    try {
        let obj = {
            ID: ID ? ID : '',
            name: name ? name : '',
            email: email ? email : '',
            profile: profile ? profile : '',
        }
        return res.status(200).json(obj);
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal server error" });
    }
});

Router.post('/changeAccount', verification, upload.single('profile'), async (req, res) => {
    const { ID, name, profile } = req;
    try {
        const formData = {
            name: req.body.name ? req.body.name : name,
            profile: (req.file && req.file.path) ? req.file.path : (req.body.profile ? req.body.profile : profile),
        }
        const accont = await Account.findByIdAndUpdate(ID, formData, { new: true });
        if (accont) {
            res.status(200).json({ status: 1, data: accont, message: "Account updated successfully" });
        } else {
            return res.status(404).json({ status: 0, message: "Email does not exist" });
        }
    } catch (err) {
        res.status(500).json({ status: 0, message: "Internal server error" });

    }
});

module.exports = Router;
