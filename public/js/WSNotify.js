const notifyRatingUpdate = require('../../ws/WSServer.js').notifyRatingUpdate;
const {
    Product,
    User
} = require('../../models/model.js');

module.exports = function WSNotify(productName) {
    Product.findOne({
        where: {
            productName: productName
        },
        include: [{
            model: User
        }]
    }).then(product => {
        if (product) {
            product.rating = 0;
            if (product.Users) {
                product.Users.forEach((user) => product.rating += user.Comment.rating);
                if (product.Users.length) {
                    product.rating = Math.round(product.rating / product.Users.length);
                }
            }
            notifyRatingUpdate(productName, product.rating);
            console.log('notifyRatingUpdate ', productName, product.rating);
        }
    })
}
// (productName, rating)