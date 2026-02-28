import { AppointmentRepository } from '../repositories/AppointmentRepository';

export class AppointmentService {
    private appointmentRepository: AppointmentRepository;

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
    }

    async getAllAppointments() {
        return await this.appointmentRepository.findAll();
    }

    async getAppointmentById(id: number) {
        return await this.appointmentRepository.findById(id);
    }

    async getAppointmentsByPet(petId: number) {
        return await this.appointmentRepository.findByPetId(petId);
    }

    async getAppointmentsByVeterinarian(veterinarianId: number) {
        return await this.appointmentRepository.findByVeterinarianId(veterinarianId);
    }

    async createAppointment(data: any) {
        return await this.appointmentRepository.create(data);
    }

    async updateAppointment(id: number, data: any) {
        return await this.appointmentRepository.update(id, data);
    }

    async deleteAppointment(id: number) {
        return await this.appointmentRepository.delete(id);
    }

    // Educational: Demonstrate Promise.all for concurrency (batch operations)
    async createBatchAppointments(appointments: any[]) {
        const results = await Promise.all(appointments.map(async (appt) => {
            return await this.appointmentRepository.create(appt);
        }));
        return results;
    }
}
