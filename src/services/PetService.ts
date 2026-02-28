import { PetRepository } from '../repositories/PetRepository';

export class PetService {
    private petRepository: PetRepository;

    constructor() {
        this.petRepository = new PetRepository();
    }

    async getAllPets() {
        return await this.petRepository.findAll();
    }

    async getPetById(id: number) {
        return await this.petRepository.findById(id);
    }

    async getPetsByOwner(ownerId: number) {
        return await this.petRepository.findByOwnerId(ownerId);
    }

    async createPet(data: any) {
        return await this.petRepository.create(data);
    }

    async updatePet(id: number, data: any) {
        return await this.petRepository.update(id, data);
    }

    async deletePet(id: number) {
        return await this.petRepository.delete(id);
    }
}
