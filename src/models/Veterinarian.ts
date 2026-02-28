import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Veterinarian extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public specialty!: string;
    public phone!: string;
    public email!: string;
}

Veterinarian.init(
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
        specialty: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'veterinarians',
    }
);

export default Veterinarian;
