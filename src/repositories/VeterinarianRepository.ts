import Veterinarian from '../models/Veterinarian';

export class VeterinarianRepository {
    async findAll() {
        return await Veterinarian.findAll();
    }

    async findById(id: number) {
        return await Veterinarian.findByPk(id);
    }

    async create(vet: any) {
        return await Veterinarian.create(vet);
    }

    async update(id: number, data: any) {
        const vet = await this.findById(id);
        if (vet) {
            return await vet.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const vet = await this.findById(id);
        if (vet) {
            await vet.destroy();
            return true;
        }
        return false;
    }
}
