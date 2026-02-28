import Owner from '../models/Owner';

export class OwnerRepository {
    async findAll() {
        return await Owner.findAll();
    }

    async findById(id: number) {
        return await Owner.findByPk(id);
    }

    async create(owner: any) {
        return await Owner.create(owner);
    }

    async update(id: number, data: any) {
        const owner = await this.findById(id);
        if (owner) {
            return await owner.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const owner = await this.findById(id);
        if (owner) {
            await owner.destroy();
            return true;
        }
        return false;
    }
}
