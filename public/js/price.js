module.exports = function getRating(orders) {
    return orders.forEach(order => {
        order.orderPrice = 0;
        if (order.Products) {
            order.Products.forEach((product) =>
                {
                    order.orderPrice += (product.productPrice * product.OrderedProduct.countOfProducts)
                }
            );
        }
    })
}