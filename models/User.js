const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            surname: { type: Sequelize.STRING, allowNull: true },
            name: { type: Sequelize.STRING, allowNull: true },
            phone: { type: Sequelize.STRING, allowNull: true },
            mail: { type: Sequelize.STRING, allowNull: false, unique:true },
            password: { type: Sequelize.STRING, allowNull: false },
            passwordSalt: {type: Sequelize.STRING, allowNull: false},
            status: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 0, max: 1 }},
            role: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 0, max: 1 }}
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'Users',
            timestamps: false
        });
    }

    // constructor(name, tel, surname, mail, password, salt, status) {
    //     super();

    //     this.Name = name;
    //     this.Phone = tel;
    //     this.Surname = surname;
    //     this.Mail = mail;
    //     this.Password = password;
    //     this.PasswordSalt = salt;
    //     this.Status = "active";

    // }
};