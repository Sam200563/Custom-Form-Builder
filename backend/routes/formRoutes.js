import express from 'express';
import { createform,getFormById,getallForms,submitResponse, updateForm } from '../controllers/formController.js';
 

const router = express.Router();

router.post('/',createform);
router.get('/',getallForms);
router.get('/:id',getFormById);
router.put('/:id',updateForm)
router.post('/:id/submit',submitResponse)


export default router;