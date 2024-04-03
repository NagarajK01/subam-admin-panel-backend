var jwt = require('jsonwebtoken');
const Account = require('../schema/account');

async function verification(req, res, next) {
    const bearerToken = req.headers.authorization;
    try {
        const decodedToken = jwt.verify(bearerToken, 'product123');
        if (decodedToken) {
            const account = await Account.findOne({ email: decodedToken.email });
            if (!account) {
                return res.sendStatus(403);
            }
            const isPasswordValid = decodedToken.password ? decodedToken.password === account.password : false;
            if (!isPasswordValid) {
                return res.sendStatus(403);
            }
            req.ID = account._id;
            req.name = account.name;
            req.email = account.email;
            req.password = account.password;
            req.profile = account.profile;
            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        res.sendStatus(403);
    }
}

module.exports = verification;