import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Owner from './Owner';

class Pet extends Model {
    public id!: number;
    public name!: string;
    public species!: string;
    public breed!: string;
    public age!: number;
    public photoUrl!: string;
    public ownerId!: number;
}

Pet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        species: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            references: {
                model: Owner,
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'pets',
    }
);

// Define associations
Owner.hasMany(Pet, { foreignKey: 'ownerId', as: 'pets' });
Pet.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner' });

export default Pet;
