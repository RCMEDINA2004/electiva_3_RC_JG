import { Request, Response } from 'express';
import { VeterinarianService } from '../services/VeterinarianService';

const veterinarianService = new VeterinarianService();

export const getVeterinarians = async (req: Request, res: Response) => {
    try {
        const vets = await veterinarianService.getAllVeterinarians();
        res.json(vets);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getVeterinarianById = async (req: Request, res: Response) => {
    try {
        const vet = await veterinarianService.getVeterinarianById(parseInt(req.params.id));
        if (!vet) {
            return res.status(404).json({ message: 'Veterinarian not found' });
        }
        res.json(vet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createVeterinarian = async (req: Request, res: Response) => {
    try {
        const vet = await veterinarianService.createVeterinarian(req.body);
        res.status(201).json(vet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateVeterinarian = async (req: Request, res: Response) => {
    try {
        const vet = await veterinarianService.updateVeterinarian(parseInt(req.params.id), req.body);
        if (!vet) {
            return res.status(404).json({ message: 'Veterinarian not found' });
        }
        res.json(vet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVeterinarian = async (req: Request, res: Response) => {
    try {
        const deleted = await veterinarianService.deleteVeterinarian(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Veterinarian not found' });
        }
        res.json({ message: 'Veterinarian deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
