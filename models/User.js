const Sequelize = require('sequelize');

const Model = Sequelize.Model;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init({
            id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
            Surname: { type: Sequelize.STRING, allowNull: true },
            Name: { type: Sequelize.STRING, allowNull: true },
            Phone: { type: Sequelize.STRING, allowNull: true },
            Mail: { type: Sequelize.STRING, allowNull: false, unique:true },
            Password: { type: Sequelize.STRING, allowNull: false },
            PasswordSalt: {type: Sequelize.STRING, allowNull: false},
            Status: { type: Sequelize.STRING, allowNull: false }
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