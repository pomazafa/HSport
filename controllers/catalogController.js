const {
    Product,
    User,
    Order,
    OrderedProduct,
    Comment
} = require('../models/model.js');

var errMessage = null;

exports.index = async function(request, response) {
    response.render("catalog.hbs", { Products: await Product.findAll() });
};

exports.add = async function(request, response) {
    response.render('createProduct.hbs', { errMessage: errMessage });
    errMessage = "";
}

exports.addPost = async function(request, response) {
    const pname = request.body.pname;
    const result = await Product.findOne({
        where: {
            productName: pname
        }
    })
    if (result != null) {
        errMessage = "Товар с данным наименованием уже существует.";
        response.redirect('/catalog/add');
    } else {
        const pdescription = request.body.pdescription;
        const pbrand = request.body.pbrand;
        const pprice = request.body.pprice;

        const filedata = request.file;
        if (!filedata)
            console.log("Ошибка при загрузке файла");

        const product = Product.build({
            Name: pname,
            productName: pname,
            productDescription: pdescription,
            brand: pbrand,
            productPrice: pprice
        })
        product.save();

        response.redirect('/catalog/');
    }
}