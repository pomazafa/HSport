module.exports = function getRating(products) {
    return products.forEach(product => {
        product.rating = 0;
        if (product.Users) {
            product.Users.forEach((user) => product.rating += user.Comment.rating);
            if (product.Users.length) {
                product.rating = Math.round(product.rating / product.Users.length);
            }
        }
    })
}