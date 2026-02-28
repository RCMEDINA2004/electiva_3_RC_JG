import Pet from '../models/Pet';
import Owner from '../models/Owner';

export class PetRepository {
    async findAll() {
        return await Pet.findAll({ include: [{ model: Owner, as: 'owner' }] });
    }

    async findById(id: number) {
        return await Pet.findByPk(id, { include: [{ model: Owner, as: 'owner' }] });
    }

    async findByOwnerId(ownerId: number) {
        return await Pet.findAll({ where: { ownerId }, include: [{ model: Owner, as: 'owner' }] });
    }

    async create(pet: any) {
        return await Pet.create(pet);
    }

    async update(id: number, data: any) {
        const pet = await Pet.findByPk(id);
        if (pet) {
            return await pet.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const pet = await Pet.findByPk(id);
        if (pet) {
            await pet.destroy();
            return true;
        }
        return false;
    }
}
