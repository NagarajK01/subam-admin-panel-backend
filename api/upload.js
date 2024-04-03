const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        var d = new Date();
        var randomName = d.getTime();

        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, randomName + fileName)
    }
});
var upload = multer({
    storage: storage,
});

module.exports = upload;
