import express from 'express'
import { UserController } from './users.controller'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

router.post('/create-user', UserController.createUser)
router.get('/:id', UserController.getSingleUser)
router.patch('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

router.get('/', UserController.getAllUsers)
export const UserRouter = router
