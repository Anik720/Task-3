import express from 'express'

import validateRequest from '../../middlewares/validateRequest'
import { CowController } from './cow.controller'

const router = express.Router()

router.post('/create-cow', CowController.createCow)
router.get('/:id', CowController.getSingleCow)
router.patch('/:id', CowController.updateCow)
router.delete('/:id', CowController.deleteCow)

router.get('/', CowController.getAllCows)
export const CowRouter = router
