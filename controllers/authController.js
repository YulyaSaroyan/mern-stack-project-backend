import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt  from 'jsonwebtoken'

import User from "../models/User.js"
import Role from "../models/Role.js"
import { secretObj } from '../config.js'

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, secretObj.secret, {expiresIn: '24h'})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'registration error', errors})
            }

            const { email, password } = req.body
            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: 'email is already registered'})
            }

            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'USER'})

            const user = new User({
                email,
                password: hashPassword,
                roles: [userRole.value]
            })

            await user.save()

            return res.json({message: 'user successfully registered'})
        } catch (error) {
            res.status(400).json({message: 'Registration error'})
        }
    }

    async logIn(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: `user with ${email} email is not found`})
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res.status(400).json({message: 'password is incorrect'})
            }

            const token = generateAccessToken(user._id, user.roles)

            return res.json({token, message: 'logged In'})
        } catch (error) {
            res.status(400).json({message: 'Log in error'})
        }
    }

    async getUsers(req, res) {
        try {
            // const userRole = new Role()
            // const adminRole = new Role({value: 'ADMIN'})
            // await userRole.save()
            // await adminRole.save()

            const users = await User.find()
            res.json(users)
        } catch (error) {
            res.status(400).json({message: 'request error'})
        }
    }
}

export default new authController()