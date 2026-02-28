import { OwnerRepository } from '../repositories/OwnerRepository';

export class OwnerService {
    private ownerRepository: OwnerRepository;

    constructor() {
        this.ownerRepository = new OwnerRepository();
    }

    async getAllOwners() {
        return await this.ownerRepository.findAll();
    }

    async getOwnerById(id: number) {
        return await this.ownerRepository.findById(id);
    }

    async createOwner(data: any) {
        return await this.ownerRepository.create(data);
    }

    async updateOwner(id: number, data: any) {
        return await this.ownerRepository.update(id, data);
    }

    async deleteOwner(id: number) {
        return await this.ownerRepository.delete(id);
    }
}
