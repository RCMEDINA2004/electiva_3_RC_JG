import { Request, Response } from 'express';
import { OwnerService } from '../services/OwnerService';

const ownerService = new OwnerService();

export const getOwners = async (req: Request, res: Response) => {
    try {
        const owners = await ownerService.getAllOwners();
        res.json(owners);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOwnerById = async (req: Request, res: Response) => {
    try {
        const owner = await ownerService.getOwnerById(parseInt(req.params.id));
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        res.json(owner);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createOwner = async (req: Request, res: Response) => {
    try {
        const owner = await ownerService.createOwner(req.body);
        res.status(201).json(owner);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOwner = async (req: Request, res: Response) => {
    try {
        const owner = await ownerService.updateOwner(parseInt(req.params.id), req.body);
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        res.json(owner);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOwner = async (req: Request, res: Response) => {
    try {
        const deleted = await ownerService.deleteOwner(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        res.json({ message: 'Owner deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
