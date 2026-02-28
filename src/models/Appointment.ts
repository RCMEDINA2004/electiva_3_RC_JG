import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Pet from './Pet';
import Veterinarian from './Veterinarian';

class Appointment extends Model {
    public id!: number;
    public petId!: number;
    public veterinarianId!: number;
    public date!: string;
    public time!: string;
    public reason!: string;
    public status!: string;
}

Appointment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        petId: {
            type: DataTypes.INTEGER,
            references: {
                model: Pet,
                key: 'id',
            },
            allowNull: false,
        },
        veterinarianId: {
            type: DataTypes.INTEGER,
            references: {
                model: Veterinarian,
                key: 'id',
            },
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
            defaultValue: 'scheduled',
        },
    },
    {
        sequelize,
        tableName: 'appointments',
    }
);

// Define associations
Pet.hasMany(Appointment, { foreignKey: 'petId', as: 'appointments' });
Appointment.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

Veterinarian.hasMany(Appointment, { foreignKey: 'veterinarianId', as: 'appointments' });
Appointment.belongsTo(Veterinarian, { foreignKey: 'veterinarianId', as: 'veterinarian' });

export default Appointment;
