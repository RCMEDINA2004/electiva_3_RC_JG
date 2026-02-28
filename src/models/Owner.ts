import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Owner extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public phone!: string;
    public email!: string;
    public address!: string;
}

Owner.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'owners',
    }
);

export default Owner;
