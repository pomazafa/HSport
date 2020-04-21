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
    Password: 'pomazafaP1'
}