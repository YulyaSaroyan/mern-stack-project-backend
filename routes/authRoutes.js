import express from 'express'
import authController from '../controllers/authController.js'
import { check } from 'express-validator'
import roleMiddleware from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/registration', [
    check('email').notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Not an email'),
    check('password', 'Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character')
    .not()
    .isIn(['password', 'god'])
    .withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
], authController.registration) 
router.post('/log-in',  authController.logIn)
router.get('/users', roleMiddleware(['USER']), authController.getUsers)

export default router