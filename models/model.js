const Sequelize = require('sequelize');

function internalORM(sequelize) {
    Product.init({
    	id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        product_name: { type: Sequelize.STRING, allowNull: false},
        product_description: { type: Sequelize.STRING, allowNull: true },
        product_price: { type: Sequelize.DOUBLE(7, 2), allowNull: false }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'Product',
        timestamps: false
    });
    User.init({
    	id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
         Surname: { type: Sequelize.STRING, allowNull: true},
         Name: { type: Sequelize.STRING, allowNull: true },
         Phone: { type: Sequelize.STRING, allowNull: true },
         Mail: { type: Sequelize.STRING, allowNull: false },
         Password: { type: Sequelize.STRING, allowNull: false },
         Status: { type: Sequelize.STRING, allowNull: false }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'User',
        timestamps: false
    });
    Order.init({
    	id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        order_status: {type: Sequelize.STRING, allowNull:false},
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        }
    },{
        sequelize,
        modelName: 'Order',
        tableName: 'Order',
        timestamps: false
    });
    Ordered_product.init({
    	id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: Product, key: 'id' }
        },
        order_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: Order, key: 'id' }
        },
    	count_of_products: {type: Sequelize.INTEGER, allowNull: false}
    }, {
        sequelize,
        modelName: 'Ordered_product',
        tableName: 'Ordered_product',
        timestamps: false
    });
    Comment.init({
    	id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
    	product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: Product, key: 'id' }
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        comment_date: {type: Sequelize.Date, allowNull: false},
        rating: {type: Sequelize.INTEGER, allowNull:true,  validate: {min: 1, max: 5}},
        message: {type: Sequelize.STRING, allowNull:true}
    },{
        sequelize,
        modelName: 'Comment',
        tableName: 'Comment',
        timestamps: false
    });
}
module.exports.ORM = (s) => { internalORM(s); return { Product, User, Order, Ordered_product, Comment}};