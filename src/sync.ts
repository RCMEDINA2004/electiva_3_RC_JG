import sequelize from './config/database';
import User from './models/User';
import Owner from './models/Owner';
import Pet from './models/Pet';
import Veterinarian from './models/Veterinarian';
import Appointment from './models/Appointment';

const syncDatabase = async () => {
    try {
        // Force models to be loaded (prevents tree-shaking)
        console.log('📦 Loading models:', User.name, Owner.name, Pet.name, Veterinarian.name, Appointment.name);

        await sequelize.authenticate();
        console.log('✅ Database connected!');
        // Force sync for educational/dev purposes to reset DB easily.
        // In production, use migrations!
        await sequelize.sync({ force: true });
        console.log('✅ Database synced!');

        // Seed admin user
        await User.create({
            username: 'rcarlosmedinap23@gmail.com',
            password: 'AzureAdmin123!', // Note: In a real app, hash this with bcrypt before saving!
            role: 'admin'
        });
        console.log('👤 Admin user created: rcarlosmedinap23@gmail.com');

        // Seed sample data
        const owner1 = await Owner.create({
            firstName: 'María',
            lastName: 'García',
            phone: '555-0101',
            email: 'maria@email.com',
            address: 'Calle 123, Ciudad'
        });

        const owner2 = await Owner.create({
            firstName: 'Carlos',
            lastName: 'López',
            phone: '555-0102',
            email: 'carlos@email.com',
            address: 'Avenida 456, Ciudad'
        });

        await Pet.create({
            name: 'Luna',
            species: 'Perro',
            breed: 'Golden Retriever',
            age: 3,
            ownerId: owner1.id
        });

        await Pet.create({
            name: 'Milo',
            species: 'Gato',
            breed: 'Siamés',
            age: 2,
            ownerId: owner2.id
        });

        await Veterinarian.create({
            firstName: 'Dr. Ana',
            lastName: 'Martínez',
            specialty: 'Medicina General',
            phone: '555-0201',
            email: 'ana.martinez@vetclinic.com'
        });

        await Veterinarian.create({
            firstName: 'Dr. Pedro',
            lastName: 'Sánchez',
            specialty: 'Cirugía',
            phone: '555-0202',
            email: 'pedro.sanchez@vetclinic.com'
        });

        console.log('🌱 Sample data seeded successfully');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

syncDatabase();
