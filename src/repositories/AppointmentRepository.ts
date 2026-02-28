import Appointment from '../models/Appointment';
import Pet from '../models/Pet';
import Veterinarian from '../models/Veterinarian';
import Owner from '../models/Owner';

export class AppointmentRepository {
    async findAll() {
        return await Appointment.findAll({
            include: [
                { model: Pet, as: 'pet', include: [{ model: Owner, as: 'owner' }] },
                { model: Veterinarian, as: 'veterinarian' }
            ]
        });
    }

    async findById(id: number) {
        return await Appointment.findByPk(id, {
            include: [
                { model: Pet, as: 'pet', include: [{ model: Owner, as: 'owner' }] },
                { model: Veterinarian, as: 'veterinarian' }
            ]
        });
    }

    async findByPetId(petId: number) {
        return await Appointment.findAll({
            where: { petId },
            include: [
                { model: Pet, as: 'pet' },
                { model: Veterinarian, as: 'veterinarian' }
            ]
        });
    }

    async findByVeterinarianId(veterinarianId: number) {
        return await Appointment.findAll({
            where: { veterinarianId },
            include: [
                { model: Pet, as: 'pet', include: [{ model: Owner, as: 'owner' }] },
                { model: Veterinarian, as: 'veterinarian' }
            ]
        });
    }

    async create(appointment: any) {
        return await Appointment.create(appointment);
    }

    async update(id: number, data: any) {
        const appointment = await Appointment.findByPk(id);
        if (appointment) {
            return await appointment.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const appointment = await Appointment.findByPk(id);
        if (appointment) {
            await appointment.destroy();
            return true;
        }
        return false;
    }
}
