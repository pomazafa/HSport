const multer = require("multer");
const path = require("path");

module.exports = {
    secret: 'SecretJWT',
    dbconf: {
        dialect: 'mysql',
        host: "localhost",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    Database: 'HSport', 
    Login: 'pomazafa',
    Password: 'pomazafaP1',
    storageConfig: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./public/images/products");
        },
        filename: (req, file, cb) => {
            cb(null, req.body.pname + path.extname(file.originalname));
        }
    })
}