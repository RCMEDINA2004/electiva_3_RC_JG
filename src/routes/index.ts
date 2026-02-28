import { Router } from 'express';
import { login } from '../controllers/AuthController';
import { getOwners, getOwnerById, createOwner, updateOwner, deleteOwner } from '../controllers/OwnerController';
import { getPets, getPetById, getPetsByOwner, createPet, updatePet, deletePet } from '../controllers/PetController';
import { getVeterinarians, getVeterinarianById, createVeterinarian, updateVeterinarian, deleteVeterinarian } from '../controllers/VeterinarianController';
import { getAppointments, getAppointmentById, getAppointmentsByPet, getAppointmentsByVeterinarian, createAppointment, updateAppointment, deleteAppointment, createBatchAppointments } from '../controllers/AppointmentController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../utils/fileUpload';

const router = Router();

// Auth (public)
router.post('/login', login);

// Owners (protected)
router.get('/owners', authMiddleware, getOwners);
router.get('/owners/:id', authMiddleware, getOwnerById);
router.post('/owners', authMiddleware, createOwner);
router.put('/owners/:id', authMiddleware, updateOwner);
router.delete('/owners/:id', authMiddleware, deleteOwner);

// Pets (protected)
router.get('/pets', authMiddleware, getPets);
router.get('/pets/:id', authMiddleware, getPetById);
router.get('/pets/owner/:ownerId', authMiddleware, getPetsByOwner);
router.post('/pets', authMiddleware, upload.single('photo'), createPet);
router.put('/pets/:id', authMiddleware, upload.single('photo'), updatePet);
router.delete('/pets/:id', authMiddleware, deletePet);

// Veterinarians (protected)
router.get('/veterinarians', authMiddleware, getVeterinarians);
router.get('/veterinarians/:id', authMiddleware, getVeterinarianById);
router.post('/veterinarians', authMiddleware, createVeterinarian);
router.put('/veterinarians/:id', authMiddleware, updateVeterinarian);
router.delete('/veterinarians/:id', authMiddleware, deleteVeterinarian);

// Appointments (protected)
router.get('/appointments', authMiddleware, getAppointments);
router.get('/appointments/:id', authMiddleware, getAppointmentById);
router.get('/appointments/pet/:petId', authMiddleware, getAppointmentsByPet);
router.get('/appointments/veterinarian/:veterinarianId', authMiddleware, getAppointmentsByVeterinarian);
router.post('/appointments', authMiddleware, createAppointment);
router.put('/appointments/:id', authMiddleware, updateAppointment);
router.delete('/appointments/:id', authMiddleware, deleteAppointment);

// Batch appointments (protected) - Demonstrates Promise.all
router.post('/appointments/batch', authMiddleware, createBatchAppointments);

export default router;
