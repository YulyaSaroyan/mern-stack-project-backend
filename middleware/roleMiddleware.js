import jwt from "jsonwebtoken"

import { secretObj } from "../config.js"

export default function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: 'user is not authorized'})
            }
            const { userRoles } = jwt.verify(token, secretObj.secret)
            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })

            if (!hasRole) {
                return res.status(403).json({message: 'you do not have access'})
            }
            next()
        } catch (error) {
            return res.status(403).json({message: 'user is not authorized'})
        }
    }
     
}
