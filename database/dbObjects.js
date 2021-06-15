const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const User = require('./models/User')(sequelize, Sequelize.DataTypes);
const Shop = require('./models/Shop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(Shop, { foreignKey: 'item_id', as: 'item' });

/* eslint-disable-next-line func-names */
User.prototype.addItem = async function (item) {
    const userItem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });

    if (userItem) {
        userItem.amount += 1;
        return userItem.save();
    }

    return UserItems.create({ user_id: this.user_id, set_name: item.set.name, item_id: item.id, name: item.name, amount: 1 });
};

/* eslint-disable-next-line func-names */
User.prototype.getItems = function () {
    return UserItems.findAll({
        where: { user_id: this.user_id },
        include: ['item'],
    });
};

module.exports = { User, Shop, UserItems };