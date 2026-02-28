import { VeterinarianRepository } from '../repositories/VeterinarianRepository';

export class VeterinarianService {
    private veterinarianRepository: VeterinarianRepository;

    constructor() {
        this.veterinarianRepository = new VeterinarianRepository();
    }

    async getAllVeterinarians() {
        return await this.veterinarianRepository.findAll();
    }

    async getVeterinarianById(id: number) {
        return await this.veterinarianRepository.findById(id);
    }

    async createVeterinarian(data: any) {
        return await this.veterinarianRepository.create(data);
    }

    async updateVeterinarian(id: number, data: any) {
        return await this.veterinarianRepository.update(id, data);
    }

    async deleteVeterinarian(id: number) {
        return await this.veterinarianRepository.delete(id);
    }
}
