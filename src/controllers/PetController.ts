import { Request, Response } from 'express';
import { PetService } from '../services/PetService';

const petService = new PetService();

export const getPets = async (req: Request, res: Response) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPetById = async (req: Request, res: Response) => {
    try {
        const pet = await petService.getPetById(parseInt(req.params.id));
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPetsByOwner = async (req: Request, res: Response) => {
    try {
        const pets = await petService.getPetsByOwner(parseInt(req.params.ownerId));
        res.json(pets);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createPet = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (req.file) {
            data.photoUrl = `/uploads/${req.file.filename}`;
        }
        const pet = await petService.createPet(data);
        res.status(201).json(pet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePet = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (req.file) {
            data.photoUrl = `/uploads/${req.file.filename}`;
        }
        const pet = await petService.updatePet(parseInt(req.params.id), data);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePet = async (req: Request, res: Response) => {
    try {
        const deleted = await petService.deletePet(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json({ message: 'Pet deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
