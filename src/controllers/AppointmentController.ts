import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';

const appointmentService = new AppointmentService();

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.getAppointmentById(parseInt(req.params.id));
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAppointmentsByPet = async (req: Request, res: Response) => {
    try {
        const appointments = await appointmentService.getAppointmentsByPet(parseInt(req.params.petId));
        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAppointmentsByVeterinarian = async (req: Request, res: Response) => {
    try {
        const appointments = await appointmentService.getAppointmentsByVeterinarian(parseInt(req.params.veterinarianId));
        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentService.updateAppointment(parseInt(req.params.id), req.body);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const deleted = await appointmentService.deleteAppointment(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Educational: Batch creation using Promise.all
export const createBatchAppointments = async (req: Request, res: Response) => {
    try {
        const { appointments } = req.body; // Expect array of appointment objects
        const results = await appointmentService.createBatchAppointments(appointments);
        res.status(201).json(results);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
